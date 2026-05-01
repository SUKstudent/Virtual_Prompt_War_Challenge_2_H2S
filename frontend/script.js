// ========== FEEDBACK FUNCTIONALITY ==========
const modal = document.getElementById('feedbackModal');
const feedbackBtn = document.getElementById('feedbackBtn');
const closeBtn = document.querySelector('.close');
const stars = document.querySelectorAll('.star');
const submitFeedback = document.getElementById('submitFeedback');
const feedbackText = document.getElementById('feedbackText');

let selectedRating = 0;

// Open modal
if(feedbackBtn) {
    feedbackBtn.onclick = () => {
        modal.style.display = 'block';
    };
}

// Close modal
if(closeBtn) {
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        resetModal();
    };
}

// Click outside to close
window.onclick = (event) => {
    if(event.target === modal) {
        modal.style.display = 'none';
        resetModal();
    }
};

// Star rating
stars.forEach(star => {
    star.onclick = () => {
        selectedRating = parseInt(star.dataset.rating);
        stars.forEach(s => {
            const rating = parseInt(s.dataset.rating);
            if(rating <= selectedRating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    };
    
    star.onmouseover = () => {
        const rating = parseInt(star.dataset.rating);
        stars.forEach(s => {
            const r = parseInt(s.dataset.rating);
            if(r <= rating) {
                s.style.color = '#ffc107';
            }
        });
    };
    
    star.onmouseout = () => {
        stars.forEach(s => {
            if(!s.classList.contains('active')) {
                s.style.color = '#ddd';
            } else {
                s.style.color = '#ffc107';
            }
        });
    };
});

// Submit feedback
if(submitFeedback) {
    submitFeedback.onclick = async () => {
        const feedback = feedbackText.value.trim();
        
        if(selectedRating === 0) {
            alert('Please select a rating!');
            return;
        }
        
        const feedbackData = {
            rating: selectedRating,
            feedback: feedback || 'No comment',
            timestamp: new Date().toISOString(),
            userId: window.currentUser?.uid || 'anonymous'
        };
        
        // Save to localStorage
        let allFeedback = JSON.parse(localStorage.getItem('civicFeedback') || '[]');
        allFeedback.push(feedbackData);
        localStorage.setItem('civicFeedback', JSON.stringify(allFeedback));
        
        // Save to Firebase if logged in
        if(window.currentUser && window.db) {
            try {
                await addDoc(collection(window.db, 'feedback'), feedbackData);
            } catch(e) {
                console.log('Feedback saved locally only');
            }
        }
        
        // Show thank you message
        showToast('🙏 Thank you for your feedback!');
        
        // Close modal and reset
        modal.style.display = 'none';
        resetModal();
    };
}

function resetModal() {
    selectedRating = 0;
    stars.forEach(s => s.classList.remove('active'));
    feedbackText.value = '';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
