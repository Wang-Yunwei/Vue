export default {
    computed: {
        loginUserInfo() {
            return JSON.parse(sessionStorage.getItem('loginUserInfo'))
        },
        AUTH_HOME_PAGE() {
            // 权限控制 - 首页
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-first-page')
        },
        AUTH_PATIENT_MANAGE() {
            // 权限控制 - 患者管理
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-patient')
        },
        AUTH_QUALITY_CONTROL_STATISTICS() {
            // 权限控制 - 质控统计
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-qc')
        },
        AUTH_REGULAR_MEETING_MANAGE() {
            // 权限控制 - 例会管理
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-regular-meeting')
        },
        AUTH_SYSTEM_SETTINGS() {
            // 权限控制 - 系统设置
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-system-setting')
        },
        AUTH_ADD() {
            // 权限控制 - 建档
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-add')
        },
        AUTH_DELETE() {
            // 权限控制 - 删除
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-delete')
        },
        AUTH_PHFA() {
            // 权限控制 - 院前急救
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-firstaid')
        },
        AUTH_PIAT() {
            // 权限控制 - 预检分诊
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-triage')
        },
        AUTH_INSPECTION() {
            // 权限控制 - 检验检查
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-inspection')
        },
        AUTH_HDAT() {
            // 权限控制 - 院内诊疗
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-treatment')
        },
        AUTH_PATIENT_OUTCOME() {
            // 权限控制 - 患者转归
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-outcome')
        },
        AUTH_SUBMIT() {
            // 权限控制 - 提交
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-submit')
        },
        AUTH_AUDIT() {
            // 权限控制 - 审核
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-audit')
        },
        AUTH_AUDIT_OVERRULE() {
            // 权限控制 - 审核驳回
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-auditreject')
        },
        AUTH_ARCHIVE() {
            // 权限控制 - 存档
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-archive')
        },
        AUTH_ARCHIVE_OVERRULE() {
            // 权限控制 - 存档驳回
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-archivereject')
        },
        AUTH_REPORT() {
            // 权限控制 - 上报
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-report')
        },
        AUTH_REVOKE() {
            // 权限控制 - 撤回
            return this.loginUserInfo?.resources?.some(el => el.sign === 'trauma-mr-revocation')
        },
    },
    methods: {
        // 根据权限的sign值判断是由拥有权限
        authBySign(val) {
            return this.loginUserInfo?.resources?.some(el => el.sign === val)
        },
    },
}