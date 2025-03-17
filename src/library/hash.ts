

export function MY_hash(algo:string, str:string) {
    return crypto.subtle.digest(algo, new TextEncoder().encode(str)).then(buf => {
      return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
    });
  }