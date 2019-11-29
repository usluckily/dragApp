<template>
<div>
    <div style="position:fixed;top:0;left:0;z-index:9999">
        <!-- <el-button @click="emitClose" type="danger">关闭</el-button> -->
    </div>

    <div id="main-content" :class="{'grid-box':status == 'auto'}">
        <div class="box"
        v-for="(i, index) in localItemList" 
        :key="index" 
        :style="styleComp(i)">
            <!-- swiper -->
            <el-carousel 
            trigger="click" 
            :height="heightScale(i.height) + 'px'"
            indicator-position="none"
            v-if="i.type == 'swiper'">
                <el-carousel-item height="100%" v-for="url in i.value" :key="url">
                    <el-image :src="url" fit="fill" style="width:100%;height:100%;"></el-image>
                </el-carousel-item>
            </el-carousel>

            <!-- video -->
            <video 
            autoplay 
            controls="false" 
            object-fit="fill"
            :src="i.value" 
            v-else-if="i.type == 'video'" 
            style="width:100%;height:100%;"></video>

            <!-- text -->
            <p v-else-if="i.type == 'text'" 
            :style="{'text-align':'center'}">{{i.value}}</p>

            <!-- image -->
            <el-image :src="i.value[0]" fit="fill" style="width:100%;height:100%;" v-else-if="i.type === 'image'"></el-image>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props:['itemList', 'status', 'editW', 'editH'],
    data(){
        return {
            content:{},
            contentGrid:[2,2],
            config:[
                {
                    type: 'swiper',
                    width:'300px',
                    height:'200px',
                    position:['10px','10px'],
                    urls: [
                        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
                        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
                        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
                        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
                        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
                        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
                        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
                    ]
                },
                {
                    type: 'swiper',
                    width:'100%',
                    height:'300px',
                    position:['220px','0px'],
                    urls: [
                        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
                        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
                    ]
                },
                {
                    type: 'video',
                    width:'500px',
                    height:'300px',
                    position:['530px','0px'],
                    url: 'https://demo-res.cloudinary.com/video/upload/w_0.4,a_20/l_cloudinary_icon,o_50,w_60,g_south_east,y_15,x_60/dog.webm'
                },
                {
                    type: 'text',
                    width:'300px',
                    height:'20px',
                    position:['530px','510px'],
                    text: 'ask打卡机圣诞卡上的卡刷道具卡和房价多少'
                }
            ]
        }
    },
    beforeCreate() {
        document.documentElement.requestFullscreen();
    },
    created() { 
        console.log(this.$route)
    },
    mounted() {
        
    },
    beforeDestroy() {
        
    },
    computed:{
        localItemList(){
            let res = this.$route.params
            if(Object.keys(res).length){
                return res.data
            }
            return this.itemList
        }
    },
    methods:{
        styleComp(item) {
            let widthScale = window.screen.width / parseFloat(this.editW),
                heightScale = window.screen.height / parseFloat(this.editH)
            return {
                width:item.width * widthScale + 'px',
                height:item.height * heightScale + 'px',
                position:this.status != 'auto' ? 'absolute' : 'relative',
                top: item.top * heightScale + 'px',
                left: item.left * widthScale + 'px',
            }
        },
        heightScale(val){
            let heightScale = window.screen.height / parseFloat(this.editH)
            return val * heightScale
        },
        renderContent() {
            this.content = document.querySelector('#content')
            let child = ''

        },
        emitClose() {
            document.exitFullscreen();
            this.$emit('close')
        }
    }
}
</script>

<style lang="less" scoped>
.box{
    border:1px solid #ccc;
    background:#fff;
}
#main-content{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 999;
    background:#fff;
    top:0;
    left:0;
    &.grid-box{
        display:grid;
    }
}
.main-box{
    width:100%;
    height:500px;
    position: relative;
}
#content{
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: 33.33% 33.33% 33.33%;
    div{
        border:1px solid #ccc;
        // height:100px;
    }
}
</style>
