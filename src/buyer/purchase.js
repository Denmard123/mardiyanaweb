document.addEventListener('DOMContentLoaded', function () {
    function initPurchaseFeature(config) {
        const toastContainer = document.getElementById(config.toastContainerId);
        const buyBtn = document.getElementById(config.buyBtnId);
        const eWalletDetails = document.getElementById(config.eWalletDetailsId);
        const eWalletBarcode = document.getElementById(config.eWalletBarcodeId);
        const eWalletBarcodeText = document.getElementById(config.eWalletBarcodeTextId);
        const atmDetails = document.getElementById(config.atmDetailsId);
        const atmAccountText = document.getElementById(config.atmAccountTextId);
        const atmBarcode = document.getElementById(config.atmBarcodeId);
        const paypalForm = document.getElementById(config.paypalFormId);

        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `bg-${type === 'success' ? 'green' : 'red'}-500 text-white p-3 rounded-lg shadow-lg mb-2`;
            toast.innerHTML = `<p>${message}</p>`;
            toastContainer.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function resetPaymentForms() {
            paypalForm.classList.add('hidden');
            eWalletDetails.classList.add('hidden');
            atmDetails.classList.add('hidden');
        }

        buyBtn.addEventListener('click', function () {
            const selectedPaymentMethod = document.querySelector(`input[name="${config.paymentMethodName}"]:checked`);
            const selectedBank = document.getElementById(config.bankNameId)?.value;
            const selectedEWallet = document.getElementById(config.eWalletProviderId)?.value;

            if (!selectedPaymentMethod) {
                showToast('Please select a payment method.', 'error');
                return;
            }

            const paymentMethod = selectedPaymentMethod.value;

            resetPaymentForms();

            if (paymentMethod === 'paypal') {
                showToast('Pay with PayPal using the account provided.', 'success');
                paypalForm.classList.remove('hidden');
            } else if (paymentMethod === 'eWallet') {
                eWalletDetails.classList.remove('hidden');
                showToast('Generating e-Wallet payment details...', 'success');
                setTimeout(() => {
                    let eWalletBarcodeValue = '';
                    if (selectedEWallet === 'ovo') {
                        eWalletBarcodeValue = '0895364454843';
                        eWalletBarcodeText.textContent = 'Barcode (OVO):';
                    } else if (selectedEWallet === 'gopay') {
                        eWalletBarcodeValue = '0895364454843';
                        eWalletBarcodeText.textContent = 'Barcode (GoPay):';
                    } else if (selectedEWallet === 'dana') {
                        eWalletBarcodeValue = '0895364454843';
                        eWalletBarcodeText.textContent = 'Barcode (DANA):';
                    }
                    JsBarcode(eWalletBarcode, eWalletBarcodeValue, {
                        format: "CODE128",
                        lineColor: "#0aa",
                        width: 2,
                        height: 100,
                        displayValue: true
                    });
                }, 1000);
            } else if (paymentMethod === 'atm') {
                atmDetails.classList.remove('hidden');
                showToast('Displaying ATM account details for the selected bank.', 'success');
                setTimeout(() => {
                    let atmAccountValue = '';
                    if (selectedBank === 'bca') atmAccountValue = 'BCA Account: 1234567890';
                    else if (selectedBank === 'bni') atmAccountValue = 'BNI Account: 9876543210';
                    else if (selectedBank === 'bri') atmAccountValue = 'BRI Account: 5556667778';
                    else if (selectedBank === 'mandiri') atmAccountValue = 'Mandiri Account: 4443332221';

                    atmAccountText.textContent = atmAccountValue;

                    JsBarcode(atmBarcode, atmAccountValue.replace(/[^0-9]/g, ''), {
                        format: "CODE128",
                        lineColor: "#0aa",
                        width: 2,
                        height: 100,
                        displayValue: true
                    });
                }, 1000);
            }
        });
    }

    initPurchaseFeature({
        toastContainerId: 'toastContainer',
        buyBtnId: 'buyBtn',
        eWalletDetailsId: 'eWalletDetails',
        eWalletBarcodeId: 'eWalletBarcode',
        eWalletBarcodeTextId: 'eWalletBarcodeText',
        atmDetailsId: 'atmDetails',
        atmAccountTextId: 'atmAccountText',
        atmBarcodeId: 'atmBarcode',
        paypalFormId: 'paypalForm',
        paymentMethodName: 'paymentMethod',
        bankNameId: 'bankName',
        eWalletProviderId: 'eWalletProvider'
    });
});
