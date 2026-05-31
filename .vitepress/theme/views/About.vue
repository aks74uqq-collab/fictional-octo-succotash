<template>
  <div class="about">
    <h1 class="title">关于拾光小栈</h1>
    <div class="about-content">
      <div class="about-item hello">
        <span class="greeting">你好，欢迎来到拾光小栈</span>
        <span class="subtitle">拾取时光的碎片，记录生活的美好</span>
      </div>
    </div>
    <div class="about-content two-col">
      <div class="about-item">
        <span class="tip">关于本站</span>
        <p class="text">
          拾光小栈是一个分享技术与生活的个人博客。在这里，我会记录学习过程中的心得体会，分享前端开发相关的技术文章，也会偶尔聊聊生活中的趣事。
        </p>
        <p class="text">
          希望你能在这里找到有用的内容，也欢迎通过底部联系方式与我交流。
        </p>
      </div>
      <div class="about-item">
        <span class="tip">关于我</span>
        <p class="text">
          一名热爱技术的前端开发者，喜欢探索新事物，追求简洁优雅的代码风格。
        </p>
        <p class="text">
          技术栈：JavaScript / Vue / React / Node.js
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.about {
  .title {
    font-size: 2.4rem;
    text-align: center;
    border: none;
  }
  .about-content {
    margin-bottom: 20px;
    &.two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    .about-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 1.2rem 2rem;
      border-radius: 12px;
      background-color: var(--main-card-background);
      border: 1px solid var(--main-card-border);
      box-shadow: 0 8px 12px -4px var(--main-border-shadow);
      .tip {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 12px;
      }
      .text {
        font-size: 16px;
        margin: 0.4rem 0;
        line-height: 1.8;
      }
      &.hello {
        justify-content: center;
        align-items: center;
        padding: 3rem 2rem;
        color: #fff;
        background-image: linear-gradient(120deg, #425aef 0%, #00d4ff 100%);
        background-size: 200% 200%;
        animation: gradientFlow 6s ease infinite;
        .greeting {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 12px;
        }
        .subtitle {
          font-size: 18px;
          opacity: 0.9;
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
