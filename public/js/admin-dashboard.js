document.addEventListener('DOMContentLoaded', async () => {
    const statusFilter = document.getElementById('statusFilter');
    const applicationsTableBody = document.getElementById('applicationsTableBody');
    const assignmentsTableBody = document.getElementById('assignmentsTableBody');

    // Load applications
    const loadApplications = async (status = '') => {
        try {
            const response = await apiRequest('/applications');
            let applications = response.data;

            if (status) {
                applications = applications.filter(app => app.status === status);
            }

            applicationsTableBody.innerHTML = applications.map(app => `
                <tr>
                    <td>${app.student.name}</td>
                    <td>${app.hostel.name}</td>
                    <td>${app.preferredRoomType}</td>
                    <td>${app.status}</td>
                    <td>${new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                        <select class="status-select" data-id="${app._id}">
                            <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="approved" ${app.status === 'approved' ? 'selected' : ''}>Approved</option>
                            <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                            <option value="assigned" ${app.status === 'assigned' ? 'selected' : ''}>Assigned</option>
                        </select>
                    </td>
                </tr>
            `).join('');

            // Add event listeners to status selects
            document.querySelectorAll('.status-select').forEach(select => {
                select.addEventListener('change', async (e) => {
                    const applicationId = e.target.dataset.id;
                    const newStatus = e.target.value;

                    try {
                        await apiRequest(`/applications/${applicationId}/status`, {
                            method: 'PATCH',
                            body: JSON.stringify({ status: newStatus })
                        });

                        showSuccess('Application status updated successfully');
                        loadApplications(statusFilter.value);
                    } catch (error) {
                        console.error('Error updating application status:', error);
                    }
                });
            });
        } catch (error) {
            console.error('Error loading applications:', error);
        }
    };

    // Load assignments
    const loadAssignments = async () => {
        try {
            const response = await apiRequest('/assignments');
            const assignments = response.data;

            assignmentsTableBody.innerHTML = assignments.map(assignment => `
                <tr>
                    <td>${assignment.student.name}</td>
                    <td>${assignment.room.hostel.name}</td>
                    <td>${assignment.room.roomNumber}</td>
                    <td>${new Date(assignment.startDate).toLocaleDateString()}</td>
                    <td>${new Date(assignment.endDate).toLocaleDateString()}</td>
                    <td>${assignment.status}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading assignments:', error);
        }
    };

    // Add event listener to status filter
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            loadApplications(e.target.value);
        });
    }

    // Initial load
    loadApplications();
    loadAssignments();
}); 