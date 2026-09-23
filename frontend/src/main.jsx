import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  Check,
  FilePlus,
  RefreshCw,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import './styles.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function App() {
  const [patients, setPatients] = React.useState([]);
  const [claims, setClaims] = React.useState([]);
  const [patientForm, setPatientForm] = React.useState({
    name: '',
    age: '',
    gender: '',
    email: '',
  });
  const [claimForm, setClaimForm] = React.useState({
    patientId: '',
    description: '',
    amount: '',
  });
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadData();
  }, []);

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [patientsData, claimsData] = await Promise.all([
        request('/patients'),
        request('/claims'),
      ]);
      setPatients(patientsData);
      setClaims(claimsData);
    } catch (err) {
      setError('Unable to load API data. Check that the Spring Boot server is running.');
    } finally {
      setLoading(false);
    }
  }

  async function createPatient(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await request('/patients', {
        method: 'POST',
        body: JSON.stringify({
          ...patientForm,
          age: Number(patientForm.age),
        }),
      });
      setPatientForm({ name: '', age: '', gender: '', email: '' });
      setMessage('Patient created successfully.');
      await loadData();
    } catch (err) {
      setError('Patient could not be created. Check all required fields.');
    }
  }

  async function createClaim(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await request('/claims', {
        method: 'POST',
        body: JSON.stringify({
          patientId: Number(claimForm.patientId),
          description: claimForm.description,
          amount: Number(claimForm.amount),
        }),
      });
      setClaimForm({ patientId: '', description: '', amount: '' });
      setMessage('Claim created successfully.');
      await loadData();
    } catch (err) {
      setError('Claim could not be created. Confirm the patient ID exists and amount is valid.');
    }
  }

  async function updateClaimStatus(id, action) {
    setError('');
    setMessage('');

    try {
      await request(`/claims/${id}/${action}`, { method: 'PUT' });
      setMessage(`Claim ${action}d successfully.`);
      await loadData();
    } catch (err) {
      setError(`Claim could not be ${action}d.`);
    }
  }

  async function deletePatient(id) {
    setError('');
    setMessage('');

    try {
      await request(`/patients/${id}`, { method: 'DELETE' });
      setMessage('Patient deleted successfully.');
      await loadData();
    } catch (err) {
      setError('Patient could not be deleted.');
    }
  }

  async function deleteClaim(id) {
    setError('');
    setMessage('');

    try {
      await request(`/claims/${id}`, { method: 'DELETE' });
      setMessage('Claim deleted successfully.');
      await loadData();
    } catch (err) {
      setError('Claim could not be deleted.');
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Claims Operations</p>
          <h1>Healthcare Claims Management</h1>
        </div>
        <button className="icon-button" onClick={loadData} title="Refresh data" type="button">
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </header>

      <section className="stats-grid">
        <Metric label="Patients" value={patients.length} />
        <Metric label="Claims" value={claims.length} />
        <Metric label="Pending" value={claims.filter((claim) => claim.status === 'PENDING').length} />
        <Metric label="Approved" value={claims.filter((claim) => claim.status === 'APPROVED').length} />
      </section>

      {(message || error || loading) && (
        <section className="status-line">
          {loading && <span>Loading latest data...</span>}
          {message && <span className="success">{message}</span>}
          {error && <span className="error">{error}</span>}
        </section>
      )}

      <section className="workspace-grid">
        <form className="panel" onSubmit={createPatient}>
          <div className="panel-header">
            <UserPlus size={20} />
            <h2>Create Patient</h2>
          </div>
          <label>
            Name
            <input
              value={patientForm.name}
              onChange={(event) => setPatientForm({ ...patientForm, name: event.target.value })}
              placeholder="Amit Rawat"
              required
            />
          </label>
          <label>
            Age
            <input
              type="number"
              min="0"
              value={patientForm.age}
              onChange={(event) => setPatientForm({ ...patientForm, age: event.target.value })}
              placeholder="30"
              required
            />
          </label>
          <label>
            Gender
            <input
              value={patientForm.gender}
              onChange={(event) => setPatientForm({ ...patientForm, gender: event.target.value })}
              placeholder="Male"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={patientForm.email}
              onChange={(event) => setPatientForm({ ...patientForm, email: event.target.value })}
              placeholder="amit@example.com"
              required
            />
          </label>
          <button className="primary-button" type="submit">
            <UserPlus size={18} />
            Create Patient
          </button>
        </form>

        <form className="panel" onSubmit={createClaim}>
          <div className="panel-header">
            <FilePlus size={20} />
            <h2>Create Claim</h2>
          </div>
          <label>
            Patient
            <select
              value={claimForm.patientId}
              onChange={(event) => setClaimForm({ ...claimForm, patientId: event.target.value })}
              required
            >
              <option value="">Select patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  #{patient.id} {patient.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Description
            <textarea
              value={claimForm.description}
              onChange={(event) => setClaimForm({ ...claimForm, description: event.target.value })}
              placeholder="Blood test and consultation"
              required
            />
          </label>
          <label>
            Amount
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={claimForm.amount}
              onChange={(event) => setClaimForm({ ...claimForm, amount: event.target.value })}
              placeholder="1200.50"
              required
            />
          </label>
          <button className="primary-button" type="submit">
            <FilePlus size={18} />
            Create Claim
          </button>
        </form>
      </section>

      <section className="data-section">
        <TableHeader icon={<Activity size={20} />} title="Patients" />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>#{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.email}</td>
                  <td>
                    <button className="danger-button" onClick={() => deletePatient(patient.id)} title="Delete patient" type="button">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-cell">No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="data-section">
        <TableHeader icon={<FilePlus size={20} />} title="Claims" />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td>#{claim.id}</td>
                  <td>{claim.patient?.name || `Patient #${claim.patientId}`}</td>
                  <td>{claim.description}</td>
                  <td>{formatCurrency(claim.amount)}</td>
                  <td><span className={`status-badge ${claim.status.toLowerCase()}`}>{claim.status}</span></td>
                  <td>
                    <div className="action-row">
                      <button className="approve-button" onClick={() => updateClaimStatus(claim.id, 'approve')} title="Approve claim" type="button">
                        <Check size={16} />
                      </button>
                      <button className="reject-button" onClick={() => updateClaimStatus(claim.id, 'reject')} title="Reject claim" type="button">
                        <X size={16} />
                      </button>
                      <button className="danger-button" onClick={() => deleteClaim(claim.id)} title="Delete claim" type="button">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-cell">No claims found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TableHeader({ icon, title }) {
  return (
    <div className="table-header">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value || 0);
}

createRoot(document.getElementById('root')).render(<App />);
