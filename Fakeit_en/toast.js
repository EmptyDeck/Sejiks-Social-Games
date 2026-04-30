/* toast.js — browser alert replacement */
(function () {
  'use strict';

  function showToast(message, type) {
    type = type || 'info'; // 'info' | 'error' | 'success'
    var existing = document.getElementById('__toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = '__toast';

    var colors = {
      error:   { bg: 'oklch(44% 0.18 15 / 0.95)',  border: 'oklch(62% 0.24 15)', color: '#fff' },
      success: { bg: 'oklch(56% 0.12 82 / 0.95)',  border: 'oklch(76% 0.16 82)', color: 'oklch(10% 0.012 255)' },
      info:    { bg: 'oklch(24% 0.015 255 / 0.95)', border: 'oklch(36% 0.012 255)', color: 'oklch(93% 0.008 255)' },
    };
    var c = colors[type] || colors.info;

    toast.style.cssText = [
      'position:fixed','top:20px','left:50%','transform:translateX(-50%)',
      'z-index:9999','max-width:340px','width:calc(100% - 40px)',
      'padding:13px 18px','border-radius:12px',
      'background:' + c.bg, 'border:1px solid ' + c.border,
      'color:' + c.color,
      'font-family:\'Noto Sans\',sans-serif','font-size:14px','font-weight:600',
      'line-height:1.4','text-align:center',
      'box-shadow:0 8px 32px rgba(0,0,0,0.4)',
      'animation:toast-in 0.25s ease',
      'pointer-events:none',
    ].join(';');
    toast.textContent = message;

    if (!document.getElementById('__toast-style')) {
      var style = document.createElement('style');
      style.id = '__toast-style';
      style.textContent = '@keyframes toast-in{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.transition = 'opacity 0.3s';
      toast.style.opacity = '0';
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 300);
    }, 2800);
  }

  window.showToast = showToast;
})();
