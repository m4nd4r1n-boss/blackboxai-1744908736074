class PixQRCode {
    constructor(options) {
        this.pixKey = "62981674662";
        this.merchantName = "NAYRO CINTRA";
        this.merchantCity = "GOIANIA";
        this.amount = options.amount || 0;
        this.qrCodeElement = options.qrCodeElement;
        this.copyPasteElement = options.copyPasteElement;
        this.initialize();
    }

    initialize() {
        this.generateQRCode();
        this.setupEventListeners();
    }

    generateQRCode() {
        if (this.qrCodeElement) {
            const payload = this.generatePayload();
            
            if (this.copyPasteElement) {
                this.copyPasteElement.value = payload;
            }

            this.qrCodeElement.innerHTML = '';
            new QRCode(this.qrCodeElement, {
                text: payload,
                width: 180,
                height: 180,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }

    pad(str, len) {
        return str.toString().padStart(len, '0');
    }

    generatePayload() {
        // Payload Format Indicator
        let payload = "000201";
        
        // Merchant Account Information
        payload += "26";
        const gui = "00" + "14" + "br.gov.bcb.pix";
        const key = "01" + this.pad(this.pixKey.length, 2) + this.pixKey;
        const merchantAccount = gui + key;
        payload += this.pad(merchantAccount.length, 2) + merchantAccount;
        
        // Merchant Category Code
        payload += "52040000";
        
        // Transaction Currency (986 = BRL)
        payload += "5303986";
        
        // Transaction Amount (if present)
        if (this.amount > 0) {
            const amount = this.amount.toFixed(2);
            payload += "54" + this.pad(amount.length, 2) + amount;
        }
        
        // Country Code
        payload += "5802BR";
        
        // Merchant Name
        payload += "59" + this.pad(this.merchantName.length, 2) + this.merchantName;
        
        // Merchant City
        payload += "60" + this.pad(this.merchantCity.length, 2) + this.merchantCity;
        
        // Additional Data Field
        const txid = "***";
        payload += "62" + "05" + this.pad(txid.length, 2) + txid;
        
        // CRC16
        payload += "6304";
        const crc = this.crc16(payload);
        payload += crc.toString(16).toUpperCase().padStart(4, '0');
        
        return payload;
    }

    crc16(payload) {
        const polynomial = 0x1021;
        let result = 0xFFFF;

        for (let i = 0; i < payload.length; i++) {
            result ^= (payload.charCodeAt(i) << 8);
            for (let j = 0; j < 8; j++) {
                if (result & 0x8000) {
                    result = ((result << 1) ^ polynomial) & 0xFFFF;
                } else {
                    result = (result << 1) & 0xFFFF;
                }
            }
        }

        return result;
    }

    update(amount) {
        this.amount = amount;
        this.generateQRCode();
    }

    setupEventListeners() {
        if (this.copyPasteElement) {
            const copyButton = this.copyPasteElement.nextElementSibling;
            if (copyButton) {
                copyButton.addEventListener('click', () => {
                    this.copyPasteElement.select();
                    document.execCommand('copy');
                    
                    const originalHTML = copyButton.innerHTML;
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyButton.innerHTML = originalHTML;
                    }, 2000);
                });
            }
        }
    }
}

window.switchPaymentMethod = function(method) {
    const pixSection = document.getElementById('pixPayment');
    const cardSection = document.getElementById('cardPayment');
    const tabs = document.querySelectorAll('.payment-tab');

    if (method === 'pix') {
        pixSection.classList.remove('hidden');
        cardSection.classList.add('hidden');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
        updateTotal();
    } else {
        pixSection.classList.add('hidden');
        cardSection.classList.remove('hidden');
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
};

window.showConfirmation = function() {
    document.getElementById('confirmationMessage').classList.remove('hidden');
};

window.copyPixCode = function() {
    const pixCode = document.getElementById('pixCode');
    pixCode.select();
    document.execCommand('copy');
    
    const button = event.currentTarget;
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        button.innerHTML = originalHTML;
    }, 2000);
};
