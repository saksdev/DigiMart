import React, { useState } from 'react';
import { CreditCard, X, QrCode, Copy, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import './Css/UPIPaymentModal.css';

export default function UPIPaymentModal({ total, items, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [referenceId, setReferenceId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const upiId = '8988344879@ptsbi';

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    window.showNotification?.('UPI ID copied to clipboard', 'success');
  };

  const handleConfirm = () => {
    if (referenceId.length < 12) {
      window.showNotification?.('Please enter a valid UPI transaction reference ID', 'warning');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirm(referenceId, total, items);
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="modal-overlay">
        <div className="modal-container modal-success">
          <div className="success-content">
            <div className="success-icon-container">
              <CheckCircle className="success-icon" />
            </div>
            <h3 className="success-title">Payment Submitted!</h3>
            <p className="success-text">Your order is being processed</p>
          </div>
          <div className="transaction-details">
            <p className="transaction-label">Transaction ID</p>
            <p className="transaction-id">{referenceId}</p>
          </div>
          <p className="success-note">Awaiting admin approval. You'll be notified once confirmed.</p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="modal-overlay">
        <div className="modal-container modal-processing">
          <div className="spinner"></div>
          <h3 className="processing-title">Processing Payment...</h3>
          <p className="processing-text">Please wait while we verify your transaction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <CreditCard className="icon" />
            </div>
            <div>
              <h3 className="modal-title">UPI Payment</h3>
              <p className="modal-total">Total: ₹{total}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-button">
            <X className="icon" />
          </button>
        </div>

        <div className="modal-body">
          {step === 1 ? (
            <div className="step-one">
              <div className="qr-container">
                <QRCodeSVG
                  value={`upi://pay?pa=${upiId}&pn=Merchant&am=${total}&cu=INR`}
                  size={128}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin={true}
                  className="qr-code"
                />
              </div>
              <p className="qr-instruction">Scan the QR code or use the UPI ID below to pay</p>

              <div className="upi-details">
                <div>
                  <p className="upi-label">UPI ID</p>
                  <p className="upi-id">{upiId}</p>
                </div>
                <button onClick={copyUpiId} className="copy-button">
                  <Copy className="copy-icon" />
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                className="action-button"
              >
                I have completed the payment
              </button>
            </div>
          ) : (
            <div className="step-two">
              <div className="transaction-details">
                <h4 className="transaction-title">Enter Transaction Details</h4>
                <p className="transaction-text">Please provide your UPI transaction reference ID</p>
              </div>

              <div className="input-container">
                <label className="input-label">UPI Transaction Reference ID *</label>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="e.g., 123456789012"
                  className="input-field"
                />
                <p className="input-hint">Find this in your UPI app under transaction history</p>
              </div>

              <div className="button-group">
                <button
                  onClick={() => setStep(1)}
                  className="back-button"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!referenceId}
                  className="confirm-button"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}