/**
 * Mock storage for leads data
 * Used as fallback when external API is unavailable
 */

// In-memory storage for leads with sample data
let mockLeads = [
  {
    leadID: 1,
    leadNo: 'E000001',
    FirstName: 'anu',
    LastName: 'saha',
    PhoneNo1: '7686263163',
    PhoneNo2: '',
    Emailid: '',
    LeadDate: '2025-12-21',
    LeadSourceID: 6, // WALK-IN
    ClinicID: 1, // Panvel
    AssignTo: 'Dr.MADHU PAWAR',
    LeadFor: 'EXTRACTION - SIMPLE',
    InterestLevel: 7,
    PatientStatus: 'Co-operative',
    PatientFollowup: 'patient',
    IsActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    leadID: 2,
    leadNo: 'E000002',
    FirstName: 'H S',
    LastName: 'yadhunandan',
    PhoneNo1: '8105597531',
    PhoneNo2: '',
    Emailid: '',
    LeadDate: '2025-12-21',
    LeadSourceID: 5, // Reference
    ClinicID: 2, // Pune
    AssignTo: 'Dr.pooja kumari',
    LeadFor: 'CONSULTATION',
    InterestLevel: 6,
    PatientStatus: 'Co-operative',
    PatientFollowup: 'patient',
    IsActive: true,
    createdAt: new Date().toISOString(),
  },
];
let nextLeadId = 3;

/**
 * Get all leads from mock storage
 * @returns {Array} List of leads
 */
export function getMockLeads() {
  return mockLeads;
}

/**
 * Add a new lead to mock storage
 * @param {Object} leadData - Lead data to add
 * @returns {Object} Saved lead with ID
 */
export function addMockLead(leadData) {
  const newLead = {
    ...leadData,
    leadID: nextLeadId++,
    leadNo: `E${String(nextLeadId - 1).padStart(6, '0')}`,
    createdAt: new Date().toISOString(),
  };

  mockLeads.push(newLead);
  console.log(`✅ Added lead to mock storage: ${newLead.leadID}`);
  return newLead;
}

/**
 * Update an existing lead in mock storage
 * @param {number} leadId - Lead ID to update
 * @param {Object} leadData - Updated lead data
 * @returns {Object} Updated lead
 */
export function updateMockLead(leadId, leadData) {
  const index = mockLeads.findIndex(lead => lead.leadID === leadId);

  if (index === -1) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }

  mockLeads[index] = {
    ...mockLeads[index],
    ...leadData,
    leadID: leadId,
    updatedAt: new Date().toISOString(),
  };

  console.log(`✅ Updated lead in mock storage: ${leadId}`);
  return mockLeads[index];
}

/**
 * Delete a lead from mock storage
 * @param {number} leadId - Lead ID to delete
 * @returns {boolean} Success status
 */
export function deleteMockLead(leadId) {
  const index = mockLeads.findIndex(lead => lead.leadID === leadId);

  if (index === -1) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }

  mockLeads.splice(index, 1);
  console.log(`✅ Deleted lead from mock storage: ${leadId}`);
  return true;
}

/**
 * Clear all leads from mock storage
 */
export function clearMockLeads() {
  mockLeads = [];
  nextLeadId = 1;
  console.log('✅ Cleared all leads from mock storage');
}
