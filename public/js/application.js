document.addEventListener('DOMContentLoaded', async () => {
    const applicationForm = document.getElementById('applicationForm');
    const hostelSelect = document.getElementById('hostel');

    // Load hostels
    try {
        const response = await apiRequest('/hostels');
        const hostels = response.data;

        hostelSelect.innerHTML = '<option value="">Select a hostel</option>' +
            hostels.map(hostel => `
                <option value="${hostel._id}">${hostel.name} - ${hostel.location}</option>
            `).join('');
    } catch (error) {
        console.error('Error loading hostels:', error);
    }

    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const hostel = document.getElementById('hostel').value;
            const preferredRoomType = document.getElementById('roomType').value;
            const additionalNotes = document.getElementById('notes').value;

            try {
                const response = await apiRequest('/applications', {
                    method: 'POST',
                    body: JSON.stringify({
                        hostel,
                        preferredRoomType,
                        additionalNotes
                    })
                });

                showSuccess('Application submitted successfully');
                window.location.href = 'student-dashboard.html';
            } catch (error) {
                console.error('Error submitting application:', error);
            }
        });
    }
}); 