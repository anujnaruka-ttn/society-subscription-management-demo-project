import { seedDashboardData } from './dashboardSeed';

// Run the dashboard seeding
seedDashboardData()
    .then((result) => {
        console.log("=== Dashboard Seeding Complete ===");
        if (result) {
            console.log("Success:", result.success);
            console.log("Message:", result.message);
            if (!result.success) {
                console.log("Error:", result.error);
            }
        }
        process.exit(0);
    })
    .catch(error => {
        console.error("=== Dashboard Seeding Failed ===");
        console.error("Error:", error);
        process.exit(1);
    });
