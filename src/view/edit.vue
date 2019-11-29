<template>
    <div style="padding:20px;">
        <el-row>
            <el-select v-model="screenType" placeholder="选择屏幕比例">
                <el-option :value="i.value" :label="i.label" v-for="(i, index) in screenTypeList" :key="index"></el-option>
            </el-select>
            <el-button @click="addNode" type="success">创建</el-button>
            <el-button @click="viewTemplate" type="success">预览</el-button>
        </el-row>

        <br/>

        <div class="content" :class="{'auto':status==='auto'}" id="view-box" :style="{width:boxWidth,height:boxHeight}">
            <!-- card -->
            <div class="item"
            v-for="(i, index) in itemList" 
            :key="index" 
            :id="i.id"
            :style="{width:i.width + 'px',height:i.height + 'px',zIndex:i.zIndex,top:i.top + 'px',left:i.left + 'px'}">
                <div class="between-flex">
                    <el-select v-model="i.type" size="mini" @change="resetBox(index)">
                      <!-- text类型只允许存在一个 -->
                      <el-option :value="j" :label="j" v-for="(j, index) in localItemTypeList" :key="index" :disabled="hasText && j=='text'"></el-option>
                    </el-select>
                    <span @click="removeItems(index)" style="cursor:pointer;">
                      <i class="el-icon-close"></i>
                    </span>
                </div>
                <br>
                <el-row>
                    <!-- image -->
                    <div v-if="i.type === 'image'">
                        <el-image
                        v-if="i.value[0]"
                        style="width: 20px; height: 20px;"
                        :src="i.value[0]"
                        fit="cover"></el-image>
                        <br>
                        <el-button type="success" size="mini" @click="showImage(index)">选择图片</el-button>
                    </div>

                    <!-- swiper -->
                    <div v-if="i.type === 'swiper'">
                        <el-row class="normal-flex">
                            <div class="img-box" 
                            v-for="(j, jIndex) in i.value"
                            :key="jIndex"
                            style="width:20px;height:20px;border-radius:5px;margin:0;">
                                <el-image
                                style="width: 100%; height: 100%;"
                                :src="j"
                                fit="cover"></el-image>
                            </div>
                        </el-row>
                        <br>
                        <el-button type="success" size="mini" @click="showImage(index)">选择图片</el-button>
                    </div>

                    <!-- text -->
                    <div v-if="i.type === 'text'">
                    <el-input type="textarea" v-model="i.value"></el-input>
                    </div>

                    <!-- video -->
                    <div v-if="i.type === 'video'">
                        <el-button type="success" size="mini" @click="showVideo(index)">选择视频</el-button>
                    </div>
                </el-row>

                <!--  -->
                <div :id="i.coorId" class="coor" v-if="status !== 'auto'"></div>
            </div>
        </div>

        <el-dialog
            title="选择图片"
            :visible.sync="imageDialogVisible"
            width="800px">
            <div id="imageDialog" style="min-height:300px">
                <div class="img-box" v-for="(i, index) in localImgUrlList" :key="index" @click="chooseImage(index)">
                    <div class="img-box-check" v-if="i.checked">
                        <i class="el-icon-circle-check"></i>
                    </div>
                    
                    <el-image
                    style="width: 100%; height: 100%;"
                    :src="i.url"
                    :key="index"
                    fit="cover">
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>  
                    </el-image>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="imageDialogVisible = false">取 消</el-button>
            <el-button type="success" @click="imageDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="选择视频"
            :visible.sync="videoDialogVisible"
            width="800px">
            <div id="videoDialog" style="min-height:300px">

            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="videoDialogVisible = false">取 消</el-button>
            <el-button type="success" @click="videoDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <mView 
        :itemList="itemList" 
        :status="status" 
        :editW="boxWidth"
        :editH="boxHeight"
        v-if="dialogVisible" 
        @close="dialogVisible = false">
        </mView>
    </div>
</template>

<script>
import $ from 'jquery'
import mView from './view'
require('@/assets/js/drag.js')

export default {
  components:{
    mView
  },
  data(){
      return {
        imageDialogVisible: false,
        imageDialogLoading: {},
        videoDialogVisible: false,
        videoDialogLoading: {},
        dialogVisible:false,
        status: 'handle',
        boxNode:{},
        boxNodeOffsetTop: 0,
        boxNodeOffsetLeft: 0,
        screenType:'1920*1080',
        screenTypeList:[
          {value:'1920*1080',label:'16:9'},
          {value:'1920*1440',label:'4:3'},
          {value:'1920*1920',label:'1:1'}
        ],
        selectItemType: '',
        localItemTypeList: ['image','swiper','text','video'],
        itemList: [],
        currentItemIndex:0,//当前选中的item
        rowNum: '',
        colNum: '',

        //mock
        testUrls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        ]
      }
    },
    created() {
      // api.login()
      // api.getImageList()
    },
    mounted() {
      this.boxNode = document.getElementById('view-box')
      this.boxNodeOffsetTop = this.boxNode.offsetTop
      this.boxNodeOffsetLeft = this.boxNode.offsetLeft
      this.init()
    },
    methods: {
      init() {
        this.itemList.forEach((item,num) => {
          this.setDrag('#item'+num, '#coor'+num, num)
        })
      },
      addNode() {
          let num = this.itemList.length
          this.status = 'handle'
          this.itemList.push({
              type:'image',
              id:'item'+num,
              width:'300',
              height:'180',
              zIndex: num + 1,
              coorId: 'coor'+num,
              top: '',
              left: '',
              value: []
          })
          this.$nextTick(() => {
              this.setDrag('#item'+num, '#coor'+num, num)
          })
      },
      removeItems(index) {
        this.$confirm('是否移除该模块?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.itemList.splice(index, 1)
        })
      },
      setDrag(dom, coorId, index) {
          let boxNodeOffsetTop = this.boxNodeOffsetTop, boxNodeOffsetLeft = this.boxNodeOffsetLeft, vm = this
          let $box = $(dom).mousedown(function(e) {
              let offset = $(this).offset(), 
              x = e.pageX - offset.left + boxNodeOffsetLeft, 
              y = e.pageY - offset.top + boxNodeOffsetTop
              
              this.posix = {'x': x + 1, 'y': y + 0.5};//连点会有位移，这里暂时这样修正一下
              $.extend(document, {'move': true, 'move_target': this});
          }).on('mousedown', coorId, function(e) {
              var posix = {
                      'w': $box.width(), 
                      'h': $box.height(), 
                      'x': e.pageX, 
                      'y': e.pageY
                  };
              
              $.extend(document, {'move': true, 'call_down': function(e) {
                  $box.css({
                      'width': Math.max(30, e.pageX - posix.x + posix.w + 20),
                      'height': Math.max(30, e.pageY - posix.y + posix.h + 20)
                  });
              }});
              return false;
          }).on('mouseup',function(e){
              let target = e.target
              target = vm.getParentNode(target, 'item')

              vm.itemList[index]['top'] = target.offsetTop
              vm.itemList[index]['left'] = target.offsetLeft
              vm.itemList[index]['width'] = target.offsetWidth
              vm.itemList[index]['height'] = target.offsetHeight
          })
      },
      autoCreate() {
          this.itemList = []
          this.status = 'auto'
          let num = this.rowNum * this.colNum
          this.boxNode.style.display = 'grid'
          this.boxNode.style.gridTemplateColumns = this.gridConfig.gridTemplateColumns = 'repeat('+this.rowNum+', '+(100/this.rowNum)+'%)'
          this.boxNode.style.gridTemplateRows = this.gridConfig.gridTemplateRows = 'repeat('+this.colNum+', '+(100/this.colNum)+'%)'
          for(let i=0;i<num;i++){
              this.itemList.push({
                  type:'text',
                  id:'item'+i,
                  zIndex: i + 1,
                  value:''
              })
          }
      },
      getParentNode(target, parentClass) {
          let resultTarget = target
          if(resultTarget.className !== parentClass){
              return this.getParentNode(resultTarget.parentNode, parentClass)
          }else{
              return resultTarget
          }
      },
      showImage(index) {
        this.currentItemIndex = index
        this.imageDialogVisible = true
        this.$nextTick(() => {
          this.imageDialogLoading = this.$loading({target:'#imageDialog',text:'图片加载中'})
          setTimeout(() => {
            this.imageDialogLoading.close()
          }, 500)
        })
      },
      chooseImage(index) {
        let current = this.currentItemIndex, 
        url = this.localImgUrlList[index].url,
        indexof = this.itemList[current].value.indexOf(url)
        if(typeof this.itemList[current].value == 'string'){
          this.itemList[current].value = []
        }
        //如果选择的item type为image，只能添加一张图片
        if(this.itemList[current].type == 'image' && this.itemList[current].value.length >= 1){
          return this.itemList[current].value = [url]
        }
        if(indexof === -1){
          this.itemList[current].value.push(url)
        }else{
          this.itemList[current].value.splice(indexof,1)
        }
        
      },
      showVideo() {
        this.videoDialogVisible = true
        this.$nextTick(() => {
          this.videoDialogLoading = this.$loading({target:'#videoDialog',text:'视频加载中'})
          setTimeout(() => {
            this.videoDialogLoading.close()
          }, 500)
        })
      },
      resetBox(index) {
        let type = this.itemList[index].type
        this.itemList[index].value = []
        if(type == 'text'){
          this.itemList[index].value = ''
        }
      },
      viewTemplate() {
        this.$router.push({name:'view', params:{data:this.itemList}})
      }
    },
    computed: {
      boxWidth() {
        return 1000 + 'px'
      },
      boxHeight() {
        let w = this.screenType.split('*')[0], h = this.screenType.split('*')[1]
        return h/w*parseFloat(this.boxWidth) + 'px'
      },
      localImgUrlList() {
        let current = this.currentItemIndex, 
        remoteList = this.testUrls, 
        checkedList = this.itemList.length ? this.itemList[current].value : []

        return remoteList.map((item, index) => {
          let res = false
          for(let i=0,len=checkedList.length;i<len;i++){
            if(checkedList[i] === item){
              res = true
              break
            }
          }
          return {
            url:item,
            checked:res
          }
        })
      },
      hasText() {
        let res = false
        for(let i=0,len=this.itemList.length;i<len;i++){
          if(this.itemList[i].type === 'text'){
            res = true
            break
          }
        }
        return res
      }
    }
}
</script>

<style scoped>
    #view-box{
        overflow: hidden;
        border: 1px solid #ccc;
        position:relative;
    }
    #view-box .item{
        padding: 10px;
        position: absolute;
        border: 1px solid #eee;
        background:#fff;
    }
    #view-box .item .coor { width: 10px; height: 10px; overflow: hidden; cursor: se-resize; position: absolute; right: 0; bottom: 0; background-color: #09C; }
    #imageDialog, #videoDialog{
        min-height:300px;
        display:flex;
        justify-content: flex-start;
        align-items: center;	
        flex-wrap: wrap;	
        align-content: stretch;
    }
    .img-box{
        width:100px;
        height:100px;
        margin:5px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        border-radius: 10px;
    }
    .img-box .img-box-check{
        position:absolute;
        top:0;
        left:0;
        z-index:99;
        background:rgba(0, 0, 0, 0.5);
        color:#1ab394;
        width:100%;
        height:100%;
        line-height: 100px;
        text-align:center;
        font-size: 36px;
    }
    #imageDialog .img-box:first-child, #imageDialog .img-box:nth-child(7n+1){
        margin-left:0;
    }
    #imageDialog .img-box:nth-child(7n){
        margin-right:0;
    }
</style>