<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="isLogin" to="/">Need a account?</nuxt-link>
            <nuxt-link v-else to="/login">Have a account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input
                v-model="user.username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                :disabled="disabled"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.email"
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                :disabled="disabled"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                :disabled="disabled"
                required
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right" :disabled="disabled">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { login } from '@/api/user'
  // 仅在客户端加载 js-cookie 包
  const Cookie = process.client ? require('js-cookie') : undefined

  export default {
    middleware: 'notAuthenticated',
    name: 'LoginIndex',
    data() {
      return {
        user: {
          username: '',
          email: '',
          password: '',
        },
        errors: {},
        disabled: false
      }
    },
    computed: {
      isLogin() {
        return this.$route.name === 'login'
      },
    },
    methods: {
      async onSubmit() {
        // 提交表单请求登录
        this.disabled = true
        try {
          const { data } = this.isLogin
            ? await login({
                user: this.user,
              })
            : await register({
                user: this.user,
              })

          this.$store.commit('setUser', data.user)

          Cookie.set('user', data.user)
          // 跳转到首页
          this.$router.push('/')
        } catch (error) {
          console.log(error)
          this.errors = error.response.data.errors
          this.disabled = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
