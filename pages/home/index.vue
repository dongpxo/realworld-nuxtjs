<!--
 * @Author: dongpx
 * @Date: 2021-01-25 22:43:45
 * @LastEditTime: 2021-02-25 23:09:28
 * @LastEditors: dongpx
 * @Description: 
 * @FilePath: /realworld-nuxtjs/pages/home/index.vue
-->
<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                    },
                  }"
                  exact
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed',
                  }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed',
                    },
                  }"
                  exact
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed',
                  }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag,
                    },
                  }"
                  exact
                  class="nav-link"
                  :class="{
                    active: tab === 'tag',
                  }"
                  >#{{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{ article.createdAt | date }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>

        <!-- 分页列表 -->
        <nav>
          <ul class="pagination">
            <li
              v-for="item in totalPage"
              :key="item"
              :class="{ active: item === page }"
              class="page-item"
            >
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    page: item,
                    tag: $route.query.tag,
                    tab: tab,
                  },
                }"
                class="page-link"
                >{{ item }}</nuxt-link
              >
            </li>
          </ul>
        </nav>
        <!-- 分页列表 -->

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="item in tags"
                :key="item"
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag',
                  },
                }"
                class="tag-pill tag-default"
                >{{ item }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getArticles,
    getFeedArticles,
    deleteFavorite,
    addFavorite,
  } from '@/api/article'
  import { getTags } from '@/api/tag'
  import { mapState } from 'vuex'

  export default {
    name: 'HomeIndex',
    async asyncData({ query, store }) {
      const page = Number.parseInt(query.page || 1)
      const limit = 20
      const { tag } = query
      const tab = query.tab || 'global-feed'
      const loadArticles =
        store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles

      const [articleRes, tagRes] = await Promise.all([
        loadArticles({
          limit,
          offset: (page - 1) * limit,
          tag,
        }),
        getTags(),
      ])

      const { articles, articlesCount } = articleRes.data
      const { tags } = tagRes.data

      articles.forEach((article) => (article.favoriteDisabled = false))

      return {
        articles,
        articlesCount,
        tags,
        limit,
        page,
        tag,
        tab: query.tab || 'global-feed',
      }
    },
    watchQuery: ['page', 'tag', 'tab'],
    computed: {
      ...mapState(['user']),
      totalPage() {
        return Math.ceil(this.articlesCount / this.limit)
      },
    },
    methods: {
      async onFavorite(article) {
        article.favoriteDisabled = true
        if (article.favorited) {
          // 取消点赞
          await deleteFavorite(article.slug)
          article.favorited = false
          article.favoritesCount += -1
        } else {
          // 添加点赞
          await addFavorite(article.slug)
          article.favorited = true
          article.favoritesCount += 1
        }
        article.favoriteDisabled = false
      },
    },
  }
</script>

<style lang="scss" scoped></style>
