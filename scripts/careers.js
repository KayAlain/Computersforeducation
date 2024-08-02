
        const filestackApiKey = 'YOUR_FILESTACK_API_KEY';
        const client = filestack.init(filestackApiKey);

        document.getElementById('job-application-form').addEventListener('submit', function(event) {
            event.preventDefault();

            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const department = document.getElementById('department').value;
            const jobType = document.getElementById('job-type').value;
            const resumeInput = document.getElementById('resume');
            const coverLetterInput = document.getElementById('cover-letter');
            const statusDiv = document.getElementById('status');

            if (resumeInput.files.length > 0) {
                const resumeFile = resumeInput.files[0];
                statusDiv.innerText = 'Uploading resume...';

                client.upload(resumeFile).then(resumeResponse => {
                    const resumeUrl = resumeResponse.url;

                    let coverLetterUrl = '';
                    if (coverLetterInput.files.length > 0) {
                        const coverLetterFile = coverLetterInput.files[0];
                        statusDiv.innerText = 'Uploading cover letter...';

                        client.upload(coverLetterFile).then(coverLetterResponse => {
                            coverLetterUrl = coverLetterResponse.url;
                            submitForm(firstName, lastName, email, department, jobType, resumeUrl, coverLetterUrl);
                        }).catch(error => {
                            statusDiv.innerText = 'Error uploading cover letter.';
                        });
                    } else {
                        submitForm(firstName, lastName, email, department, jobType, resumeUrl, coverLetterUrl);
                    }
                }).catch(error => {
                    statusDiv.innerText = 'Error uploading resume.';
                });
            } else {
                statusDiv.innerText = 'Please select a resume to upload.';
            }
        });

        function submitForm(firstName, lastName, email, department, jobType, resumeUrl, coverLetterUrl) {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('department', department);
            formData.append('jobType', jobType);
            formData.append('resumeUrl', resumeUrl);
            if (coverLetterUrl) {
                formData.append('coverLetterUrl', coverLetterUrl);
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': 'Bearer YOUR_WEB3FORMS_ACCESS_KEY'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('status').innerText = 'Application submitted successfully!';
                } else {
                    document.getElementById('status').innerText = 'Failed to submit application. Please try again.';
                }
            })
            .catch(error => {
                document.getElementById('status').innerText = 'Error submitting application.';
            });
        }