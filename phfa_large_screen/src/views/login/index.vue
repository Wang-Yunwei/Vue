<template>
  <div class="login-wrapper flex-c-c">
    <div class="login">
      <h1 class="title txt-c">
        <gradient-text>急救专科大屏</gradient-text>
      </h1>
      <a-form :form="form" ref="form" class="form" @submit="handleSubmit">
        <a-form-item>
          <a-input v-decorator="[
        'username',
        {
          rules: [{ required: true, message: '请输入用户名!' }],
        },
      ]" autofocus size="large" placeholder="用户名">
            <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.5)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="[
        'password',
        {
          rules: [{ required: true, message: '请输入密码!' }],
        },
      ]" size="large" type="password" placeholder="密码">
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.5)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" block>登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getAuthToken, getBusinessToken } from "@/api";
import { mapMutations } from "vuex";
import { message } from "ant-design-vue";
export default {
  data() {
    return {};
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    ...mapMutations(["setHospitalId"]),
    async getBusinessToken(authToken) {
      const res = await getAuthToken({
        authJwtToken: authToken,
      });
      if (res.code === "000000") {
        const token = res.body?.businessToken?.jwt_token;
        const hospitalId = res.body?.loginUserInfo?.user?.hospitalId;
        console.log(hospitalId, 'hospitalId');
        this.setHospitalId(hospitalId);
        localStorage.setItem("token", token);
        this.$router.push("/");
      }
    },
    async getAuthToken(data) {
      const res = await getAuthToken(data);
      if (res.code === "000000") {
        this.getBusinessToken(res.body?.jwt_token);
      } else {
        message.error(res.message);
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.getAuthToken(values);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-wrapper {
  min-height: 100%;
  background-color: #0c2541;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAD9CAYAAAB3NXH8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA3MTFGQ0U5OTNGMTExRUM4MDBDQjIzODQ0QjVEMkVDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA3MTFGQ0VBOTNGMTExRUM4MDBDQjIzODQ0QjVEMkVDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDcxMUZDRTc5M0YxMTFFQzgwMENCMjM4NDRCNUQyRUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDcxMUZDRTg5M0YxMTFFQzgwMENCMjM4NDRCNUQyRUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4a7keMAAAC30lEQVR42uzdMYoCQRRFUVtM3f9CXUCbGMpDREzuOclEhcHnDlXBp4/zPO8XIOP2+vv442/ev/w95357zvyi87v6vwctogfRA6IHRA+IHhA9IHpA9IDoAdEDogdED4geED2IHhA9IHpA9IDoAdEDogdED4geED0geuBjh2/ZQYtv2XXPmV90fq734E0PiB4QPSB6QPSA6AHRA6IHRA+IHhA9sNmygxhbdt1z5hedn+s9eNMDogdED4geED0gekD0gOgB0QOiB0QPbLbsIMaWXfec+UXn53oP3vSA6AHRA6IHRA+IHhA9IHpA9IDoAdEDmy07iLFl1z1nftH5ud6DNz0gekD0gOgB0QOiB0QPiB4QPSB6QPTAZssOYmzZdc+ZX3R+rvfgTQ+IHhA9IHpA9IDoAdEDogdED4geED2w2bKDGFt23XPmF52f6z140wOiB0QPiB4QPSB6QPSA6AHRA6IHRA9stuwgxpZd95z5Refneg/e9IDoAdEDogdED4geED0gekD0gOgB0QOiB0QPogdED4geED0gekD0gOgB0QOiB0QPiB4QPfCeb9lBjG/Zdc+ZX3R+rvfgTQ+IHhA9IHpA9IDoAdEDogdED4geED2w2bKDGFt23XPmF52f6z140wOiB0QPiB4QPSB6QPSA6AHRA6IHRA9stuwgxpZd95z5Refneg/e9IDoAdEDogdED4geED0gekD0gOgB0QObLTuIsWXXPWd+0fm53oM3PSB6QPSA6AHRA6IHRA+IHhA9IHpA9MBmyw5ibNl1z5lfdH6u9+BND4geED0gekD0gOgB0QOiB0QPiB4QPbDZsoMYW3bdc+YXnZ/rPXjTA6IHRA+IHhA9IHpA9IDoAdEDogdED2y27CDGll33nPlF5+d6D970gOgB0QOiB0QPiB4QPSB6QPSA6AHRA6IHRA+iB0QPiB4QPSB6QPSA6AHRA6IHRA+IHhA98J5v2UHMU4ABAFxVE7jZ96p4AAAAAElFTkSuQmCC);
  position: relative;

  .login {
    border-radius: 6px;
    background-color: rgba(21, 53, 84, 0.4);
    padding: 40px 60px;
    border: 1px solid rgba(49, 97, 146, 0.5);

    .title {
      font-size: 38px;
      margin-bottom: 40px;
    }

    .form {
      width: 360px;
    }
  }
}
</style>
