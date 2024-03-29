/*
 * @Author: dongpx
 * @Date: 2021-02-06 21:48:52
 * @LastEditTime: 2021-03-21 01:02:40
 * @LastEditors: dongpx
 * @Description: 获取公共的文章列表
 * @FilePath: /realworld-nuxtjs/api/article.js
 */
import { request } from '@/plugins/request'

// 获取公共文章列表
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params,
  })
}

// 获取关注的用户文章列表
export const getFeedArticles = (params) => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    params,
  })
}

// 添加点赞
export const addFavorite = (slug) => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/favorite`,
  })
}

// 取消点赞
export const deleteFavorite = (slug) => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}/favorite`,
  })
}

// 获取文章详情
export const getArticle = (slug) => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}`,
  })
}

// 创建文章
export const createArticle = (data) => {
  return request({
    method: 'POST',
    url: '/api/articles',
    data,
  })
}

// 更新文章
export const updateArticle = (slug, data) => {
  return request({
    method: 'PUT',
    url: `/api/articles/${slug}`,
    data,
  })
}


// 删除文章
export const deleteArticle = (slug) => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}`,
  })
}

// 获取文章评论
export const getComments = (slug) => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}/comments`,
  })
}

// 发表评论
export const addComments = (slug, data) => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/comments`,
    data,
  })
}