module.exports = {
    devServer: {
        // proxy: {
        //     '/api': {
        //         target: 'http://192.168.2.58:8080',
        //         changeOrigin: true, 
        //         pathRewrite:{'^/api':''}
        //     }
        //     
        // },
        open:true,
        host:'0.0.0.0'    
    },
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'router': '@/router',
                'request': '@/request',
                'store': '@/store',
                'views': '@/views',
                'Vendor': '@/Vendor',
                'util': '@/util',
                'components':'@/components'
           }
        }
    }
}


