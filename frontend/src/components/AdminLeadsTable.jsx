import { formatInr, formatGrams, maskMobile, formatDate } from '../utils/format';

export default function AdminLeadsTable({ leads }) {
  if (leads.length === 0) {
    return <p className="empty-state">No leads collected yet.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="leads-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Mobile</th>
            <th>Net Weight</th>
            <th>Purity</th>
            <th>Selected Plan</th>
            <th>Calculated Loan Value</th>
            <th>Status</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.applicationId}>
              <td>{lead.customerName}</td>
              <td>{maskMobile(lead.mobileNumber)}</td>
              <td>{formatGrams(lead.netWeightGrams)}</td>
              <td>{lead.purityKarat}K</td>
              <td>{lead.selectedPlanName}</td>
              <td>{formatInr(lead.calculatedLoanAmountInr)}</td>
              <td>
                <span className="status-pill">{lead.status}</span>
              </td>
              <td>{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
