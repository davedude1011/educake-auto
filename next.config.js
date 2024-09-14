/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    async reWrites() {
        return [
            {
                source: "/redirect/:path*",
                destination: "https://my.educake.co.uk/api/student/quiz/:path*",
                permanent: false,
            }
        ]
    }
};

export default config;
