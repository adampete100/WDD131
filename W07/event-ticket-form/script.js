document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ticket-form');
    const userTypeSelect = document.getElementById('user-type');
    const eventDateInput = document.getElementById('event-date');
    const dynamicField = document.getElementById('dynamic-field');
    const dynamicLabel = document.getElementById('dynamic-label');
    const dynamicInput = document.getElementById('dynamic-input');
    const errorContainer = document.getElementById('error-container');
    const successContainer = document.getElementById('success-container');

    userTypeSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        
        if (selectedValue === 'student') {
            dynamicField.classList.remove('hidden');
            dynamicLabel.textContent = 'Student I#';
            dynamicInput.placeholder = 'e.g., 123456789';
            dynamicInput.required = true;
        } else if (selectedValue === 'guest') {
            dynamicField.classList.remove('hidden');
            dynamicLabel.textContent = 'Access Code';
            dynamicInput.placeholder = 'Enter event code';
            dynamicInput.required = true;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        errorContainer.classList.add('hidden');
        errorContainer.innerHTML = '';
        successContainer.classList.add('hidden');
        successContainer.innerHTML = '';

        const errors = [];

        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const userType = userTypeSelect.value;
        const dynamicValue = dynamicInput.value.trim();

        if (!firstName) errors.push('First Name is required.');
        if (!lastName) errors.push('Last Name is required.');
        if (!email) errors.push('Email is required.');
        if (!userType) errors.push('Please select a User Type.');

        const eventDateValue = eventDateInput.value;
        if (!eventDateValue) {
            errors.push('Event Date is required.');
        } else {
            const selectedDate = new Date(eventDateValue + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate <= today) {
                errors.push('The event date must be later than the current date.');
            }
        }

        if (userType === 'student') {
            const digitRegex = /^\d{9}$/;
            if (!digitRegex.test(dynamicValue)) {
                errors.push('Student I# must be exactly a 9-digit number.');
            }
        } else if (userType === 'guest') {
            if (dynamicValue !== 'EVENT131') {
                errors.push('Access Code must be exactly "EVENT131".');
            }
        }

        if (errors.length > 0) {
            errorContainer.innerHTML = `<ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
            errorContainer.classList.remove('hidden');
        } else {
            successContainer.innerHTML = `
                <h3>Ticket Created Successfully!</h3>
                <p><strong>Attendee:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Type:</strong> ${userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
                <p><strong>Event Date:</strong> ${eventDateValue}</p>
                <p><strong>${dynamicLabel.textContent}:</strong> ${dynamicValue}</p>
            `;
            successContainer.classList.remove('hidden');
            form.reset();
            dynamicField.classList.add('hidden');
        }
    });
});