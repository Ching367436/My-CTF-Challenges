const app = Vue.createApp({
    data() {
        return {
            buttonMessage: "Check!",
            flag: "",
        }
    },
    mounted() {
        fetch('/init')
            .then(response => response.text())
            .then(data => {
                eval(this.decrypt(data))
            })
    },
    methods: {
        decrypt(encryptedHex) {
            var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            // When ready to decrypt the hex string, convert it back to bytes
            var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
        
            // The counter mode of operation maintains internal state, so to
            // decrypt a new instance must be instantiated.
            var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
            var decryptedBytes = aesCtr.decrypt(encryptedBytes);
        
            // Convert our bytes back into text
            var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
            return decryptedText;
            // "Text may be any length you wish, no padding is required."
        },
        checkFlag() {
            window.flag = this.flag;
            fetch(`/check-flag?flag=${this.flag}`, {
                method: 'DELETE'
            })
                .then(response => response.text())
                .then(data => {
                    eval(this.decrypt(data))
                    if (checkFlag(this.flag)) {
                        Swal.fire({
                            title: "Good job!",
                            text: "Your flag is correct!",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Oops...",
                            text: "Your flag is wrong!",
                            icon: "error"
                        });
                    }
                })
        }
    }

})
app.mount('#app')