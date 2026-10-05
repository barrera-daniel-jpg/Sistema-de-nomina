document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    const formData = new URLSearchParams();
    formData.append('username', u);
    formData.append('password', p);

    try {
        const res = await fetch('http://localhost:8000/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            window.location.href = '/dashboard.html';
        } else {
            document.getElementById('errorMsg').style.display = 'block';
        }
    } catch (err) {
        console.error(err);
    }
});
