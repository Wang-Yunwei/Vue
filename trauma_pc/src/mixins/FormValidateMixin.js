export default {
    data() {
        return {
            formFields: [
                { label: 'patientRegist.idNumber', value: '身份证' },
                { label: 'patientRegist.age', value: '年龄' },
                { label: 'patientRegist.ageMonth', value: '年龄' },
                { label: 'patientRegist.phoneNumber', value: '联系电话' },
                { label: 'patientRegist.height', value: '身高' },
                { label: 'patientRegist.weight', value: '体重' },
                { label: 'sign.temperature', value: '体温' },
                { label: 'sign.heartRate', value: '心率' },
                { label: 'sign.plus', value: '脉搏' },
                { label: 'sign.breath', value: '呼吸' },
                { label: 'sign.sbp', value: '收缩压' },
                { label: 'sign.dbp', value: '舒张压' },
                { label: 'sign.spo', value: '血氧' },
                { label: 'sign.bloodglucose', value: '血糖' },
                { label: 'surgers', value: '手术次数' },
            ]
        };
    },
    methods: {
        validateVitalSigns(rule, value, callback) {
            // 校验信息
            let result = true
            let errorMessage = ''
            switch (rule.field) {
                case 'patientRegist.phoneNumber': // 联系电话校验
                    if (value && !/^1[3|4|5|7|8]\d{9}$/.test(value)) {
                        result = false
                        errorMessage = '请输入正确的手机号'
                    }
                    break
                case 'patientRegist.idNumber': // 校验身份证
                    if (value && value.length !== 18) {
                        result = false
                        errorMessage = '长度必须18个字符'
                    }
                    break
                case 'patientRegist.height': // 校验身高
                    if (value < 1 || value > 300) {
                        result = false
                        errorMessage = '请输入1-300之间的数'
                    }
                    break;
                case 'patientRegist.weight': // 校验体重
                    if (value < 1 || value > 400) {
                        result = false
                        errorMessage = '请输入1-400之间的数'
                    }
                    break;
                case 'sign.temperature': // 校验体温
                    if (value < 30 || value > 47) {
                        result = false
                        errorMessage = '请输入30-47之间的数'
                    }
                    break;
                case 'sign.heartRate': // 校验心率
                    if (value < 0 || value > 300) {
                        result = false
                        errorMessage = '请输入0-300之间的整数'
                    }
                    break;
                case 'sign.plus': // 校验脉搏
                    if (value < 0 || value > 300) {
                        result = false
                        errorMessage = '请输入0-300之间的整数'
                    }
                    break;
                case 'sign.breath': // 校验呼吸
                    if (value < 0 || value > 50) {
                        result = false
                        errorMessage = '请输入0-50之间的整数'
                    }
                    break;
                case 'sign.sbp': // 校验血压-收缩压
                    if (value < 0 || value > 300) {
                        result = false
                        errorMessage = '请输入0-300之间的整数'
                    }
                    break;
                case 'sign.dbp': // 校验血压-舒张压
                    if (value < 0 || value > 300) {
                        result = false
                        errorMessage = '请输入0-300之间的整数'
                    }
                    break;
                case 'sign.spo': // 校验血氧
                    if (value < 0 || value > 100) {
                        result = false
                        errorMessage = '请输入0-100之间的数'
                    }
                    break;
                case 'sign.bloodglucose': // 校验血糖
                    if (value < 0 || value > 100) {
                        result = false
                        errorMessage = '请输入0-100之间的数'
                    }
                    break;
                case 'surgers': // 手术次数
                    if (value < 0 || value > 20) {
                        result = false
                        errorMessage = '请输入0-20之间的整数'
                    }
                    break;
                default:
                    break;
            }
            if (result) {
                callback();
            } else {
                callback(new Error(errorMessage));
            }
        },
    },
}