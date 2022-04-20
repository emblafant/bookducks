module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'aeeb71d2a9d05ecc3fa86ba97e1d830c'),
  },
});
