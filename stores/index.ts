import {defineStore} from 'pinia'

export const authStore = defineStore('authStore', {
    state: () => ({
        bearerToken: '',
        user: {} as AuthUser,
        referral_code: '',
    }),
    persist: true,
    actions: {
        logout() {
            this.bearerToken = '';
            this.user = {} as AuthUser;
        },
        setBearerToken(bearerToken: BearerToken) {
            this.bearerToken = bearerToken.access_token;
            this.user = bearerToken.user;
        },
        setUser(user: AuthUser) {
            this.user = user;
        },
        enable2FA() {
            this.user.two_factor_auth = true;
        },
        disable2FA() {
            this.user.two_factor_auth = false;
        },
        setPremium() {
            this.user.license_plan = 'premium';
        },
        setRef(ref: string) {
            this.referral_code = ref;
        }
    },
    getters: {
        isPremium(): boolean {
            return this.user.license_plan !== 'free';
        },
        isAuthenticated(): boolean {
            return this.bearerToken !== '';
        },
        isAdmin(): boolean {
            return this.user.is_admin;
        },
        isVerified(): boolean {
            return this.user.email_verified_at !== null;
        },
        is2FAEnabled(): boolean {
            return this.user.two_factor_auth;
        },
    },
})
