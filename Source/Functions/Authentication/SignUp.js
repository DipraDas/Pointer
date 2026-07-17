const SIGN_UP = {
    HANDLE_SIGNUP: ({
        name,
        email,
        password,
        confirmPassword,
    }) => {
        if (!name || !email || !password || !confirmPassword) {
            console.log('Please complete all fields');
            return false;
        }

        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            return false;
        }

        console.log({
            name,
            email,
            password,
        });

        return true;
    },
};

export default SIGN_UP;