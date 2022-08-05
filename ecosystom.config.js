module.exports = {
    apps: [
        {
            name: 'Comic App Service',
            exec_mode: 'cluster', // fork or cluster
            instances: 'max', // Or a number of instances
            script: 'yarn start',
            args: 'start',
        },
    ],
};
