import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { ILead, LeadStatus, LeadSource, UserRole, PaginationMetadata } from '../types';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Download, Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';

const LeadsList: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<ILead[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    search: '',
    sort: 'latest',
    page: 1
  });

  const [searchInput, setSearchInput] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { status, source, search, sort, page } = filters;
      const response = await api.get('/leads', {
        params: { status, source, search, sort, page }
      });
      setLeads(response.data.data);
      setMetadata(response.data.pagination);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (error) {
      alert('Failed to delete lead');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Failed to export CSV');
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      [LeadStatus.NEW]: 'bg-blue-100 text-blue-700',
      [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-700',
      [LeadStatus.QUALIFIED]: 'bg-green-100 text-green-700',
      [LeadStatus.LOST]: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-500">View and manage your sales pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          {user?.role === UserRole.ADMIN && (
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          )}
          <Link
            to="/leads/new"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
        >
          <option value="">All Statuses</option>
          {Object.values(LeadStatus).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>

        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.source}
          onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value, page: 1 }))}
        >
          <option value="">All Sources</option>
          {Object.values(LeadSource).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>

        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-bottom border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Source</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">Loading leads...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">No leads found.</td></tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-center">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-center">{lead.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize text-center">{lead.source}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm text-center">
                      {new Date(lead.createdAt!).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/leads/edit/${lead._id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        {user?.role === UserRole.ADMIN && (
                          <button
                            onClick={() => handleDelete(lead._id!)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {metadata && metadata.pages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{leads.length}</span> of <span className="font-semibold">{metadata.total}</span> leads
            </p>
            <div className="flex items-center space-x-2">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 px-2">
                Page {filters.page} of {metadata.pages}
              </span>
              <button
                disabled={filters.page === metadata.pages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsList;
