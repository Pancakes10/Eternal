document.addEventListener('DOMContentLoaded', () => {
    const plans = document.querySelectorAll('.plan');
    const planTitle = document.getElementById('plan-title');
    const planDescription = document.getElementById('plan-description');
    const showcaseImagesContainer = document.getElementById('showcase-images');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const signInButton = document.getElementById('sign-in');
    const signOutButton = document.getElementById('sign-out');
    const subscribeButtons = document.querySelectorAll('.plan button');

    const profilePopup = document.getElementById('profile-popup');
    const closePopup = document.querySelector('.close-popup');
    const popupAvatar = document.getElementById('popup-avatar');
    const popupUsername = document.getElementById('popup-username');
    const popupEmail = document.getElementById('popup-email');

    const signinPromptPopup = document.getElementById('signin-prompt-popup');
    const closeSigninPopup = signinPromptPopup.querySelector('.close-popup');


    const burgerIcon = document.querySelector('.burger-icon');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    burgerIcon.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close the dropdown if clicked outside
    window.addEventListener('click', (event) => {
        if (!burgerIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });

    // Parse the user data from the URL if it exists
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');

    let user = null;
    if (userParam) {
        user = JSON.parse(decodeURIComponent(userParam));

        // Update the UI with user information
        userAvatar.src = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'default-avatar.png';
        popupAvatar.src = userAvatar.src;
        popupUsername.textContent = user.username;
        popupEmail.textContent = user.email;

        userProfile.style.display = 'flex';
        signInButton.style.display = 'none';
        signOutButton.style.display = 'block';

        userProfile.addEventListener('click', () => {
            profilePopup.style.display = 'block';
        });
    } else {
        signOutButton.style.display = 'none';
    }

    closePopup.addEventListener('click', () => {
        profilePopup.style.display = 'none';
        signinPromptPopup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === profilePopup || event.target === closeSigninPopup) {
            profilePopup.style.display = 'none';
            signinPromptPopup.style.display = 'none';
            //closeSigninPopup.style.display = 'none';
        }
    });

    subscribeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            if (user) {
                // Redirect to Stripe Checkout
                const response = await fetch('/create-checkout-session', {
                    method: 'POST',
                });
                const session = await response.json();
                const stripe = Stripe('pk_test_51PhH3uRtvELQjuVTAEhwXZFkUKgvfT1Ru33NQwPqPZA4eEX6JMfBgcrV7AB6WultbliWx0wFstbAcLyfyMQCFK9S00sJLWxSV3');
                await stripe.redirectToCheckout({ sessionId: session.id });
            } else {
                signinPromptPopup.style.display = 'block';
            }
        });
    });

    signInButton.addEventListener('click', () => {
        window.location.href = 'https://1e4b5f15-8a81-4ba4-9de8-4bde54e575cf-00-20nh4m3lsw1gm.picard.replit.dev/auth/discord';  // Ensure this URL is correct
    });

    signOutButton.addEventListener('click', () => {
        window.location.href = 'https://1e4b5f15-8a81-4ba4-9de8-4bde54e575cf-00-20nh4m3lsw1gm.picard.replit.dev/logout';
    });




    plans.forEach(plan => {
        plan.addEventListener('click', () => {
            plans.forEach(p => p.classList.remove('active'));
            plan.classList.add('active');
            const planType = plan.getAttribute('data-plan');
            displayPlanDetails(planType);
        });
    });

    // Initialize the first plan as active and display its details
    const initialPlan = plans[0].getAttribute('data-plan');
    displayPlanDetails(initialPlan);
    plans[0].classList.add('active');
});
