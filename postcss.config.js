module.exports = {
    plugins: [
        require('css-mqpacker')({
            sort: true
        }),
        require('cssnano')({
            "preset": ["advanced", {
                "autoprefixer": {
                    "add": true
                },
                "reduceTransforms": false
            }],
        })
    ],
};
