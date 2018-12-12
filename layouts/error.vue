<template>
  <main>
    <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4 17h-8v-2h8v2zm-.499-6.296l-1.298 1.296-1.203-1.204 1.298-1.296-1.298-1.296 1.203-1.204 1.298 1.296 1.296-1.296 1.203 1.204-1.297 1.296 1.297 1.296-1.202 1.204-1.297-1.296zm-7 0l-1.298 1.296-1.203-1.204 1.298-1.296-1.298-1.296 1.203-1.204 1.298 1.296 1.296-1.296 1.203 1.204-1.297 1.296 1.297 1.296-1.202 1.204-1.297-1.296z"/></svg>
    <h1 v-if="error.statusCode === 404">404</h1>
    <h1 v-else>{{error.message}}</h1>
    <nuxt-link to="/">
      <svg width="24" height="24" viewBox="0 0 24 24"><path transform="rotate(180) translate(-24,-24)" fill="currentColor" d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
      <strong>Try something else</strong>
    </nuxt-link>
  </main>
</template>

<script>
  export default {
    props: ['error'],
  }
</script>

<style lang="scss" scoped>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;

    > * {
      animation: appear 350ms both;

      @for $i from 1 through 10 {
        &:nth-child(#{$i}) {
          animation-delay: ($i - 1) * 100ms;
        }
      }
    }

    &:before {
      content: '';
      flex: .5;
    }

    > svg {
      font-size: 5em;
      width: 1em;
      height: 1em;
      color: rgba(black,.1);
    }
  }

  h1 {
    animation-delay: 100ms;
  }

  a {
    display: flex;
    align-items: center;
    color: #f9183d;
    text-decoration: none;
    padding: 1em;
    border-radius: 3px;
    border: 1px solid;
    animation-delay: 200ms;

    &:hover,
    &:focus {
      background-color: #f9183d;
      border-color: #f9183d;
      color: white;
    }

    svg {
      width: 1em;
      height: 1em;
      margin-right: 1em;
    }
  }
</style>
