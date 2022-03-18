<template>
  <div class="app-container">
    <h3>文章标题</h3>
    <el-input v-model.trim="form.title" placeholder="请输入文章标题" />
    <h3>文章编辑</h3>
    <editor
      ref="toastuiEditor"
      :initial-value="form.htmlContent"
      initial-edit-type="markdown"
      height="500px"
      :options="editorOptions"
    />
    <h3>文章描述</h3>
    <el-input
      v-model="form.description"
      type="textarea"
      placeholder="请输入文章描述"
      maxlength="200"
      rows="10"
      show-word-limit
    />
    <h3>文章头图</h3>
    <Upload v-model="form.thumb" />
    <h3>选择分类</h3>
    <el-select v-model="form.categoryId" placeholder="请选择文章分类" @change="handleChange">
      <el-option
        v-for="item in blogCategory"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <div style="margin: 20px 0;">
      <el-button type="primary" @click="handleSubmit">{{ buttonContent }}</el-button>
    </div>
  </div>
</template>

<script>
import { Editor } from '@toast-ui/vue-editor';
// 引入toast-ui的css样式
import '@toast-ui/editor/dist/toastui-editor.css';
// 在设置中文之前需要引入中文语言包
import '@toast-ui/editor/dist/esm/i18n/zh-cn';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
// 代码高亮所需的css文件
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
// toast-ui编辑器代码高亮插件
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js';
import Upload from '@/components/Upload';
import { getBlogCategory } from '@/api/blogCategory';
import { addBlog, modifyBlog, getBlog } from '@/api/blog.js';
export default {
  components: {
    editor: Editor,
    Upload
  },
  props: {
    mode: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      // 需要提交的表单数据
      form: {
        title: '',
        description: '',
        htmlContent: '',
        thumb: '',
        categoryId: ''
      },
      // toast-ui 编辑器配置
      editorOptions: {
        minHeight: '300px',
        language: 'zh-CN',
        usageStatistics: false,
        hideModeSwitch: false,
        placeholder: '在此输入文章内容',
        // 语法高亮插件
        plugins: [codeSyntaxHighlight, colorSyntax]
      },
      // 博客分类数据
      blogCategory: [],
      buttonContent: '发布文章'
    };
  },
  created() {
    // 加载博客分类的数据
    getBlogCategory().then(r => {
      this.blogCategory = r.data;
    });
    if (this.mode === 'edit') {
      // 如果是修改模式，则还需要获取数据进行回填
      const blogId = this.$route.params.id;
      this.buttonContent = '修改文章';
      // 从路由的参数中获取文章id后，根据id获取文章数据，并回填至表单
      getBlog(blogId).then(r => {
        if (r.code === 0) {
          const { data } = r;
          this.form = data;
          this.form.categoryId = data.category === null ? '' : data.category.id;
          this.$refs.toastuiEditor.invoke('setHTML', data.htmlContent, false);
        }
      }).catch(e => {
        if (typeof e === 'string') {
          e = JSON.parse(e);
        }
        this.$message.error(e.msg);
      });
    }
  },
  methods: {
    handleSubmit() {
      // 获取编辑器中的 HTML 文本内容
      const htmlContent = this.$refs.toastuiEditor.invoke('getHTML');
      // 验证所填内容是否完整
      if (this.form.title && this.form.description && htmlContent && this.form.categoryId) {
        const createDate = +new Date();
        // 整理出需要提交的数据
        const blogInfo = {
          ...this.form,
          createDate,
          htmlContent
        };
        if (this.mode === 'edit') {
          const blogId = this.$route.params.id;
          modifyBlog(blogId, blogInfo).then(r => {
            if (r.code === 0) {
              this.$message.success('修改成功');
              this.$router.push({ name: 'ArticleList' });
            }
          }).catch(e => {
            if (typeof e === 'string') {
              e = JSON.parse(e);
              this.$message.error(e.msg);
            }
          });
        } else if (this.mode === 'add') {
          addBlog(blogInfo).then(r => {
            if (r.code === 0) {
              this.$message.success('发布成功');
              this.$router.push({ name: 'ArticleList' });
            }
          }).catch(e => {
            if (typeof e === 'string') {
              e = JSON.parse(e);
              this.$message.error(e.msg);
            }
          });
        }
      } else {
        this.$message.warning('还有部分内容未填写');
      }
    },
    handleChange() {
      this.$forceUpdate();
    }
  }
};
</script>

<style>
</style>
