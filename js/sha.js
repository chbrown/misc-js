(function() {/*
 A JavaScript implementation of the SHA family of hashes, as defined in FIPS
 PUB 180-2 as well as the corresponding HMAC implementation as defined in
 FIPS PUB 198a

 Copyright Brian Turek 2008-2012
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnson
*/
function p(a){throw a;}var q=null;function r(a,c){this.a=a;this.b=c}function x(a,c){var b=[],g=(1<<c)-1,f=a.length*c,h;for(h=0;h<f;h+=c)b[h>>>5]|=(a.charCodeAt(h/c)&g)<<32-c-h%32;return{value:b,binLen:f}}function y(a){var c=[],b=a.length,g,f;0!==b%2&&p("String of HEX type must be in byte increments");for(g=0;g<b;g+=2)f=parseInt(a.substr(g,2),16),isNaN(f)&&p("String of HEX type contains invalid characters"),c[g>>>3]|=f<<24-4*(g%8);return{value:c,binLen:4*b}}
function A(a){var c=[],b=0,g,f,h,i,k;-1===a.search(/^[a-zA-Z0-9=+\/]+$/)&&p("Invalid character in base-64 string");g=a.indexOf("=");a=a.replace(/\=/g,"");-1!==g&&g<a.length&&p("Invalid '=' found in base-64 string");for(f=0;f<a.length;f+=4){k=a.substr(f,4);for(h=i=0;h<k.length;h+=1)g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(k[h]),i|=g<<18-6*h;for(h=0;h<k.length-1;h+=1)c[b>>2]|=(i>>>16-8*h&255)<<24-8*(b%4),b+=1}return{value:c,binLen:8*b}}
function D(a,c){var b="",g=4*a.length,f,h;for(f=0;f<g;f+=1)h=a[f>>>2]>>>8*(3-f%4),b+="0123456789abcdef".charAt(h>>>4&15)+"0123456789abcdef".charAt(h&15);return c.outputUpper?b.toUpperCase():b}
function E(a,c){var b="",g=4*a.length,f,h,i;for(f=0;f<g;f+=3){i=(a[f>>>2]>>>8*(3-f%4)&255)<<16|(a[f+1>>>2]>>>8*(3-(f+1)%4)&255)<<8|a[f+2>>>2]>>>8*(3-(f+2)%4)&255;for(h=0;4>h;h+=1)b=8*f+6*h<=32*a.length?b+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(i>>>6*(3-h)&63):b+c.b64Pad}return b}
function H(a){var c={outputUpper:!1,b64Pad:"="};try{a.hasOwnProperty("outputUpper")&&(c.outputUpper=a.outputUpper),a.hasOwnProperty("b64Pad")&&(c.b64Pad=a.b64Pad)}catch(b){}"boolean"!==typeof c.outputUpper&&p("Invalid outputUpper formatting option");"string"!==typeof c.b64Pad&&p("Invalid b64Pad formatting option");return c}function J(a,c){return a>>>c|a<<32-c}
function Q(a,c){var b=q,b=new r(a.a,a.b);return b=32>=c?new r(b.a>>>c|b.b<<32-c,b.b>>>c|b.a<<32-c):new r(b.b>>>c-32|b.a<<64-c,b.a>>>c-32|b.b<<64-c)}function R(a,c){var b=q;return b=32>=c?new r(a.a>>>c,a.b>>>c|a.a<<32-c):new r(0,a.a>>>c-32)}function S(a,c,b){return a&c^~a&b}function T(a,c,b){return new r(a.a&c.a^~a.a&b.a,a.b&c.b^~a.b&b.b)}function U(a,c,b){return a&c^a&b^c&b}function V(a,c,b){return new r(a.a&c.a^a.a&b.a^c.a&b.a,a.b&c.b^a.b&b.b^c.b&b.b)}
function aa(a){return J(a,2)^J(a,13)^J(a,22)}function ba(a){var c=Q(a,28),b=Q(a,34),a=Q(a,39);return new r(c.a^b.a^a.a,c.b^b.b^a.b)}function ca(a){return J(a,6)^J(a,11)^J(a,25)}function da(a){var c=Q(a,14),b=Q(a,18),a=Q(a,41);return new r(c.a^b.a^a.a,c.b^b.b^a.b)}function ea(a){return J(a,7)^J(a,18)^a>>>3}function fa(a){var c=Q(a,1),b=Q(a,8),a=R(a,7);return new r(c.a^b.a^a.a,c.b^b.b^a.b)}function ga(a){return J(a,17)^J(a,19)^a>>>10}
function ha(a){var c=Q(a,19),b=Q(a,61),a=R(a,6);return new r(c.a^b.a^a.a,c.b^b.b^a.b)}function W(a,c){var b=(a&65535)+(c&65535);return((a>>>16)+(c>>>16)+(b>>>16)&65535)<<16|b&65535}function ia(a,c,b,g){var f=(a&65535)+(c&65535)+(b&65535)+(g&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(g>>>16)+(f>>>16)&65535)<<16|f&65535}function Y(a,c,b,g,f){var h=(a&65535)+(c&65535)+(b&65535)+(g&65535)+(f&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(g>>>16)+(f>>>16)+(h>>>16)&65535)<<16|h&65535}
function ja(a,c){var b,g,f;b=(a.b&65535)+(c.b&65535);g=(a.b>>>16)+(c.b>>>16)+(b>>>16);f=(g&65535)<<16|b&65535;b=(a.a&65535)+(c.a&65535)+(g>>>16);g=(a.a>>>16)+(c.a>>>16)+(b>>>16);return new r((g&65535)<<16|b&65535,f)}
function ka(a,c,b,g){var f,h,i;f=(a.b&65535)+(c.b&65535)+(b.b&65535)+(g.b&65535);h=(a.b>>>16)+(c.b>>>16)+(b.b>>>16)+(g.b>>>16)+(f>>>16);i=(h&65535)<<16|f&65535;f=(a.a&65535)+(c.a&65535)+(b.a&65535)+(g.a&65535)+(h>>>16);h=(a.a>>>16)+(c.a>>>16)+(b.a>>>16)+(g.a>>>16)+(f>>>16);return new r((h&65535)<<16|f&65535,i)}
function la(a,c,b,g,f){var h,i,k;h=(a.b&65535)+(c.b&65535)+(b.b&65535)+(g.b&65535)+(f.b&65535);i=(a.b>>>16)+(c.b>>>16)+(b.b>>>16)+(g.b>>>16)+(f.b>>>16)+(h>>>16);k=(i&65535)<<16|h&65535;h=(a.a&65535)+(c.a&65535)+(b.a&65535)+(g.a&65535)+(f.a&65535)+(i>>>16);i=(a.a>>>16)+(c.a>>>16)+(b.a>>>16)+(g.a>>>16)+(f.a>>>16)+(h>>>16);return new r((i&65535)<<16|h&65535,k)}
function Z(a,c){var b=[],g,f,h,i,k,m,n,j,l,e=[1732584193,4023233417,2562383102,271733878,3285377520],z=[1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,
1859775393,1859775393,1859775393,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782];a[c>>>5]|=128<<24-c%32;a[(c+
65>>>9<<4)+15]=c;l=a.length;for(n=0;n<l;n+=16){g=e[0];f=e[1];h=e[2];i=e[3];k=e[4];for(j=0;80>j;j+=1)b[j]=16>j?a[j+n]:(b[j-3]^b[j-8]^b[j-14]^b[j-16])<<1|(b[j-3]^b[j-8]^b[j-14]^b[j-16])>>>31,m=20>j?Y(g<<5|g>>>27,f&h^~f&i,k,z[j],b[j]):40>j?Y(g<<5|g>>>27,f^h^i,k,z[j],b[j]):60>j?Y(g<<5|g>>>27,U(f,h,i),k,z[j],b[j]):Y(g<<5|g>>>27,f^h^i,k,z[j],b[j]),k=i,i=h,h=f<<30|f>>>2,f=g,g=m;e[0]=W(g,e[0]);e[1]=W(f,e[1]);e[2]=W(h,e[2]);e[3]=W(i,e[3]);e[4]=W(k,e[4])}return e}
function $(a,c,b){var g,f,h,i,k,m,n,j,l,e,z,F,s,K,v,t,L,M,w,B,C,u,N,O,d,P,G=[],X,I;"SHA-224"===b||"SHA-256"===b?(z=64,g=(c+65>>>9<<4)+15,K=16,v=1,d=Number,t=W,L=ia,M=Y,w=ea,B=ga,C=aa,u=ca,O=U,N=S,P=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,
3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],e="SHA-224"===b?[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428]:[1779033703,
3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]):"SHA-384"===b||"SHA-512"===b?(z=80,g=(c+128>>>10<<5)+31,K=32,v=2,d=r,t=ja,L=ka,M=la,w=fa,B=ha,C=ba,u=da,O=V,N=T,P=[new d(1116352408,3609767458),new d(1899447441,602891725),new d(3049323471,3964484399),new d(3921009573,2173295548),new d(961987163,4081628472),new d(1508970993,3053834265),new d(2453635748,2937671579),new d(2870763221,3664609560),new d(3624381080,2734883394),new d(310598401,1164996542),new d(607225278,1323610764),
new d(1426881987,3590304994),new d(1925078388,4068182383),new d(2162078206,991336113),new d(2614888103,633803317),new d(3248222580,3479774868),new d(3835390401,2666613458),new d(4022224774,944711139),new d(264347078,2341262773),new d(604807628,2007800933),new d(770255983,1495990901),new d(1249150122,1856431235),new d(1555081692,3175218132),new d(1996064986,2198950837),new d(2554220882,3999719339),new d(2821834349,766784016),new d(2952996808,2566594879),new d(3210313671,3203337956),new d(3336571891,
1034457026),new d(3584528711,2466948901),new d(113926993,3758326383),new d(338241895,168717936),new d(666307205,1188179964),new d(773529912,1546045734),new d(1294757372,1522805485),new d(1396182291,2643833823),new d(1695183700,2343527390),new d(1986661051,1014477480),new d(2177026350,1206759142),new d(2456956037,344077627),new d(2730485921,1290863460),new d(2820302411,3158454273),new d(3259730800,3505952657),new d(3345764771,106217008),new d(3516065817,3606008344),new d(3600352804,1432725776),new d(4094571909,
1467031594),new d(275423344,851169720),new d(430227734,3100823752),new d(506948616,1363258195),new d(659060556,3750685593),new d(883997877,3785050280),new d(958139571,3318307427),new d(1322822218,3812723403),new d(1537002063,2003034995),new d(1747873779,3602036899),new d(1955562222,1575990012),new d(2024104815,1125592928),new d(2227730452,2716904306),new d(2361852424,442776044),new d(2428436474,593698344),new d(2756734187,3733110249),new d(3204031479,2999351573),new d(3329325298,3815920427),new d(3391569614,
3928383900),new d(3515267271,566280711),new d(3940187606,3454069534),new d(4118630271,4000239992),new d(116418474,1914138554),new d(174292421,2731055270),new d(289380356,3203993006),new d(460393269,320620315),new d(685471733,587496836),new d(852142971,1086792851),new d(1017036298,365543100),new d(1126000580,2618297676),new d(1288033470,3409855158),new d(1501505948,4234509866),new d(1607167915,987167468),new d(1816402316,1246189591)],e="SHA-384"===b?[new d(3418070365,3238371032),new d(1654270250,914150663),
new d(2438529370,812702999),new d(355462360,4144912697),new d(1731405415,4290775857),new d(41048885895,1750603025),new d(3675008525,1694076839),new d(1203062813,3204075428)]:[new d(1779033703,4089235720),new d(3144134277,2227873595),new d(1013904242,4271175723),new d(2773480762,1595750129),new d(1359893119,2917565137),new d(2600822924,725511199),new d(528734635,4215389547),new d(1541459225,327033209)]):p("Unexpected error in SHA-2 implementation");a[c>>>5]|=128<<24-c%32;a[g]=c;X=a.length;for(F=0;F<
X;F+=K){c=e[0];g=e[1];f=e[2];h=e[3];i=e[4];k=e[5];m=e[6];n=e[7];for(s=0;s<z;s+=1)G[s]=16>s?new d(a[s*v+F],a[s*v+F+1]):L(B(G[s-2]),G[s-7],w(G[s-15]),G[s-16]),j=M(n,u(i),N(i,k,m),P[s],G[s]),l=t(C(c),O(c,g,f)),n=m,m=k,k=i,i=t(h,j),h=f,f=g,g=c,c=t(j,l);e[0]=t(c,e[0]);e[1]=t(g,e[1]);e[2]=t(f,e[2]);e[3]=t(h,e[3]);e[4]=t(i,e[4]);e[5]=t(k,e[5]);e[6]=t(m,e[6]);e[7]=t(n,e[7])}"SHA-224"===b?I=[e[0],e[1],e[2],e[3],e[4],e[5],e[6]]:"SHA-256"===b?I=e:"SHA-384"===b?I=[e[0].a,e[0].b,e[1].a,e[1].b,e[2].a,e[2].b,e[3].a,
e[3].b,e[4].a,e[4].b,e[5].a,e[5].b]:"SHA-512"===b?I=[e[0].a,e[0].b,e[1].a,e[1].b,e[2].a,e[2].b,e[3].a,e[3].b,e[4].a,e[4].b,e[5].a,e[5].b,e[6].a,e[6].b,e[7].a,e[7].b]:p("Unexpected error in SHA-2 implementation");return I}
window.jsSHA=function(a,c,b){var g=q,f=q,h=q,i=q,k=q,m=0,n=[0],j=0,l=q,j="undefined"!==typeof b?b:8;8===j||16===j||p("charSize must be 8 or 16");"HEX"===c?(0!==a.length%2&&p("srcString of HEX type must be in byte increments"),l=y(a),m=l.binLen,n=l.value):"ASCII"===c||"TEXT"===c?(l=x(a,j),m=l.binLen,n=l.value):"B64"===c?(l=A(a),m=l.binLen,n=l.value):p("inputFormat must be HEX, TEXT, ASCII, or B64");this.getHash=function(a,c,b){var j=q,l=n.slice(),v="";switch(c){case "HEX":j=D;break;case "B64":j=E;
break;default:p("format must be HEX or B64")}"SHA-1"===a?(q===g&&(g=Z(l,m)),v=j(g,H(b))):"SHA-224"===a?(q===f&&(f=$(l,m,a)),v=j(f,H(b))):"SHA-256"===a?(q===h&&(h=$(l,m,a)),v=j(h,H(b))):"SHA-384"===a?(q===i&&(i=$(l,m,a)),v=j(i,H(b))):"SHA-512"===a?(q===k&&(k=$(l,m,a)),v=j(k,H(b))):p("Chosen SHA variant is not supported");return v};this.getHMAC=function(a,b,c,f,g){var h,i,k,l,w,B=[],C=[],u=q;switch(f){case "HEX":h=D;break;case "B64":h=E;break;default:p("outputFormat must be HEX or B64")}"SHA-1"===c?
(k=64,w=160):"SHA-224"===c?(k=64,w=224):"SHA-256"===c?(k=64,w=256):"SHA-384"===c?(k=128,w=384):"SHA-512"===c?(k=128,w=512):p("Chosen SHA variant is not supported");"HEX"===b?(u=y(a),l=u.binLen,i=u.value):"ASCII"===b||"TEXT"===b?(u=x(a,j),l=u.binLen,i=u.value):"B64"===b?(u=A(a),l=u.binLen,i=u.value):p("inputFormat must be HEX, TEXT, ASCII, or B64");a=8*k;b=k/4-1;k<l/8?(i="SHA-1"===c?Z(i,l):$(i,l,c),i[b]&=4294967040):k>l/8&&(i[b]&=4294967040);for(k=0;k<=b;k+=1)B[k]=i[k]^909522486,C[k]=i[k]^1549556828;
c="SHA-1"===c?Z(C.concat(Z(B.concat(n),a+m)),a+w):$(C.concat($(B.concat(n),a+m,c)),a+w,c);return h(c,H(g))}};})();
