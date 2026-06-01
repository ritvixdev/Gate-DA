/* matmul-lab.js — step through C = A·B one cell at a time.
   Highlights row i of A and column j of B, shows the dot product, fills C[i][j].
   DOM-based (no canvas). Mounts on #matmul-lab. */
(function () {
  "use strict";
  window.__vizInit = window.__vizInit || [];
  window.__vizInit.push(function () {
    var stage = document.getElementById("matmul-lab");
    if (!stage) return;
    var readout = document.getElementById("matmul-lab-readout");
    var A = [[1, 2, 3], [4, 5, 6]];
    var B = [[7, 8], [9, 10], [11, 12]];
    var order = [[0, 0], [0, 1], [1, 0], [1, 1]];
    var step = -1, timer = null;

    function grid(cap, rows, cols, idp, filled) {
      var html = '<div class="mm-block"><div class="mm-cap">' + cap + '</div>';
      html += '<div class="mm-mat" style="--cols:' + cols + '">';
      for (var i = 0; i < rows.length; i++) for (var j = 0; j < rows[i].length; j++)
        html += '<span class="mm-cell' + (filled ? ' mm-empty' : '') + '" id="' + idp + '-' + i + '-' + j + '">' + (filled ? '·' : rows[i][j]) + '</span>';
      return html + "</div></div>";
    }
    var Cinit = [["·", "·"], ["·", "·"]];
    stage.innerHTML = grid("A (2×3)", A, 3, "mmA") + '<span class="mm-op">×</span>' +
      grid("B (3×2)", B, 2, "mmB") + '<span class="mm-op">=</span>' +
      grid("C (2×2)", Cinit, 2, "mmC", true);

    function clearHi() {
      [].forEach.call(stage.querySelectorAll(".mm-cell"), function (c) { c.classList.remove("mm-hi"); });
    }
    function doStep(k) {
      clearHi();
      var i = order[k][0], j = order[k][1], terms = [], sum = 0;
      for (var t = 0; t < 3; t++) {
        document.getElementById("mmA-" + i + "-" + t).classList.add("mm-hi");
        document.getElementById("mmB-" + t + "-" + j).classList.add("mm-hi");
        terms.push(A[i][t] + "·" + B[t][j]); sum += A[i][t] * B[t][j];
      }
      var cc = document.getElementById("mmC-" + i + "-" + j);
      cc.textContent = sum; cc.classList.remove("mm-empty"); cc.classList.add("mm-filled");
      if (readout) readout.innerHTML = "<strong>C[" + (i + 1) + "][" + (j + 1) + "]</strong> = row " + (i + 1) + " of A · col " + (j + 1) + " of B = " + terms.join(" + ") + " = <strong>" + sum + "</strong>";
    }
    function next() {
      if (step >= order.length - 1) { stop(); return; }
      step++; doStep(step);
    }
    function reset() {
      stop(); step = -1; clearHi();
      [].forEach.call(stage.querySelectorAll("#mmC-0-0,#mmC-0-1,#mmC-1-0,#mmC-1-1"), function (c) { c.textContent = "·"; c.classList.remove("mm-filled"); c.classList.add("mm-empty"); });
      if (readout) readout.innerHTML = "Press <strong>Step</strong>: each cell of C is one row of A dotted with one column of B.";
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function auto() { stop(); if (step >= order.length - 1) reset(); timer = setInterval(function () { if (step >= order.length - 1) { stop(); return; } next(); }, 900); }
    var bs = document.getElementById("mm-step"), ba = document.getElementById("mm-auto"), br = document.getElementById("mm-reset");
    if (bs) bs.addEventListener("click", function () { stop(); next(); });
    if (ba) ba.addEventListener("click", auto);
    if (br) br.addEventListener("click", reset);
    reset();
  });
})();
