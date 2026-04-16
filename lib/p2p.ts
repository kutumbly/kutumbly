/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 * Contact     :  kutumbly@outlook.com
 * Web         :  kutumbly.com | aitdl.com | aitdl.in
 *
 * © 2026 Kutumbly.com — All Rights Reserved
 * Unauthorized use or distribution is prohibited.
 *
 * "Memory, Not Code."
 * ============================================================ */

export class P2PNode {
  pc: RTCPeerConnection;
  dc?: RTCDataChannel;
  onConnected?: () => void;
  onData?: (data: ArrayBuffer) => void;
  onConnecting?: () => void;
  onDisconnected?: () => void;

  constructor() {
    // Empty iceServers forces local-network-only discovery! Pure Zero Cloud.
    this.pc = new RTCPeerConnection({ iceServers: [] });

    this.pc.ondatachannel = (e) => {
      this.dc = e.channel;
      this.setupDC();
    };

    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === 'connected') this.onConnected?.();
      if (this.pc.connectionState === 'disconnected' || this.pc.connectionState === 'failed') this.onDisconnected?.();
      if (this.pc.connectionState === 'connecting') this.onConnecting?.();
    };
  }

  private setupDC() {
    if (!this.dc) return;
    this.dc.binaryType = 'arraybuffer';
    this.dc.onopen = () => this.onConnected?.();
    this.dc.onmessage = (e) => this.onData?.(e.data);
    this.dc.onclose = () => this.onDisconnected?.();
  }

  sendData(buffer: ArrayBuffer) {
    if (this.dc?.readyState === 'open') {
      this.dc.send(buffer);
    } else {
      console.error("DataChannel not open");
    }
  }

  async createHostOffer(): Promise<string> {
    this.dc = this.pc.createDataChannel('kutumbly-vault-sync');
    this.setupDC();

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    return new Promise((resolve) => {
      if (this.pc.iceGatheringState === 'complete') {
        resolve(btoa(JSON.stringify(this.pc.localDescription)));
      } else {
        const checkState = () => {
          if (this.pc.iceGatheringState === 'complete') {
            this.pc.removeEventListener('icegatheringstatechange', checkState);
            resolve(btoa(JSON.stringify(this.pc.localDescription)));
          }
        };
        this.pc.addEventListener('icegatheringstatechange', checkState);
        // Force resolve after 3 seconds to avoid indefinite hanging if local networks are strict
        setTimeout(() => {
           this.pc.removeEventListener('icegatheringstatechange', checkState);
           resolve(btoa(JSON.stringify(this.pc.localDescription)));
        }, 3000);
      }
    });
  }

  async acceptGuestAnswer(answerBase64: string) {
    try {
      const answer = JSON.parse(atob(answerBase64));
      await this.pc.setRemoteDescription(answer);
    } catch (e) {
      throw new Error("Invalid Handshake Answer String");
    }
  }

  async acceptHostOfferAndCreateAnswer(offerBase64: string): Promise<string> {
    try {
      const offer = JSON.parse(atob(offerBase64));
      await this.pc.setRemoteDescription(offer);
      
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);

      return new Promise((resolve) => {
        if (this.pc.iceGatheringState === 'complete') {
          resolve(btoa(JSON.stringify(this.pc.localDescription)));
        } else {
          const checkState = () => {
            if (this.pc.iceGatheringState === 'complete') {
              this.pc.removeEventListener('icegatheringstatechange', checkState);
              resolve(btoa(JSON.stringify(this.pc.localDescription)));
            }
          };
          this.pc.addEventListener('icegatheringstatechange', checkState);
          
          setTimeout(() => {
             this.pc.removeEventListener('icegatheringstatechange', checkState);
             resolve(btoa(JSON.stringify(this.pc.localDescription)));
          }, 3000);
        }
      });
    } catch (e) {
      throw new Error("Invalid Handshake Offer String");
    }
  }
}
