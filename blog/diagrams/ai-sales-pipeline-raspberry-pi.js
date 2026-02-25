/**
 * Hand-drawn diagrams for "We Built an Autonomous Sales Pipeline on a Raspberry Pi"
 * Uses Rough.js for sketchy/hand-drawn rendering
 *
 * Color palette (matches sifrventures.com):
 *   Purple:     #635BFF
 *   Dark blue:  #0a2540
 *   Light purple: #f1f3ff
 *   Gray text:  #6C6C6C
 *   Green:      #22c55e
 *   Yellow:     #f59e0b
 *   Light gray: #e5e5e5
 */

document.addEventListener('DOMContentLoaded', function () {
  if (typeof rough === 'undefined') return;

  drawAgentArchitecture();
  drawPipelineFlow();
  drawApprovalTiers();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function createSVG(container, width, height) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
  svg.setAttribute('width', '100%');
  svg.style.maxWidth = width + 'px';
  container.appendChild(svg);
  return svg;
}

function addText(svg, x, y, text, opts) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  el.setAttribute('x', x);
  el.setAttribute('y', y);
  el.setAttribute('text-anchor', opts.anchor || 'middle');
  el.setAttribute('font-family', "'Inter', sans-serif");
  el.setAttribute('font-size', opts.size || 14);
  el.setAttribute('font-weight', opts.weight || 400);
  el.setAttribute('fill', opts.fill || '#0a2540');
  el.textContent = text;
  svg.appendChild(el);
  return el;
}

function addCaption(container, text) {
  var p = document.createElement('p');
  p.className = 'diagram-caption';
  p.textContent = text;
  container.appendChild(p);
}

// ── Diagram 1: Agent Architecture ─────────────────────────────────────────────

function drawAgentArchitecture() {
  var container = document.getElementById('diagram-agent-architecture');
  if (!container) return;

  var W = 780, H = 420;
  var svg = createSVG(container, W, H);
  var rc = rough.svg(svg);

  // CEO box at top
  svg.appendChild(rc.rectangle(320, 15, 140, 50, {
    fill: '#635BFF', fillStyle: 'solid', stroke: '#0a2540', roughness: 1.5
  }));
  addText(svg, 390, 46, 'CEO', { size: 16, weight: 700, fill: '#fff' });

  // Agent boxes — middle row
  var agents = [
    { name: 'CMO', x: 30 },
    { name: 'SDR', x: 180 },
    { name: 'Events', x: 330 },
    { name: 'Social', x: 480 },
    { name: 'CTO', x: 630 },
  ];

  agents.forEach(function (a) {
    svg.appendChild(rc.rectangle(a.x, 120, 120, 50, {
      fill: '#f1f3ff', fillStyle: 'solid', stroke: '#635BFF', roughness: 1.5
    }));
    addText(svg, a.x + 60, 151, a.name, { size: 14, weight: 600, fill: '#0a2540' });

    // Arrow from CEO to agent
    svg.appendChild(rc.line(390, 65, a.x + 60, 120, {
      stroke: '#6C6C6C', strokeWidth: 1.2, roughness: 1
    }));
  });

  // Arrows down to file layer
  var files = [
    { label: 'research/', x: 30, w: 120 },
    { label: 'crm/leads/', x: 180, w: 120 },
    { label: 'events/', x: 330, w: 120 },
    { label: 'content/', x: 480, w: 120 },
    { label: 'reports/', x: 630, w: 120 },
  ];

  files.forEach(function (f, i) {
    // Arrow from agent to file
    svg.appendChild(rc.line(f.x + 60, 170, f.x + 60, 240, {
      stroke: '#635BFF', strokeWidth: 1.5, roughness: 1
    }));
    // Arrowhead
    svg.appendChild(rc.line(f.x + 60, 240, f.x + 54, 232, {
      stroke: '#635BFF', strokeWidth: 1.5, roughness: 0.5
    }));
    svg.appendChild(rc.line(f.x + 60, 240, f.x + 66, 232, {
      stroke: '#635BFF', strokeWidth: 1.5, roughness: 0.5
    }));

    // File box
    svg.appendChild(rc.rectangle(f.x, 245, f.w, 44, {
      fill: '#fff', fillStyle: 'solid', stroke: '#0a2540', roughness: 1.8
    }));
    addText(svg, f.x + 60, 272, f.label, { size: 13, weight: 500, fill: '#635BFF' });
  });

  // Horizontal "shared filesystem" bracket
  svg.appendChild(rc.line(30, 310, 750, 310, {
    stroke: '#e5e5e5', strokeWidth: 2, roughness: 1
  }));
  addText(svg, 390, 340, 'Shared Filesystem (Markdown)', {
    size: 13, fill: '#6C6C6C', weight: 500
  });

  // Cross-read arrows: SDR reads research/, CTO reads crm/
  svg.appendChild(rc.line(90, 245, 240, 170, {
    stroke: '#6C6C6C', strokeWidth: 1, roughness: 1.5,
    strokeLineDash: [6, 4]
  }));
  addText(svg, 140, 202, 'reads', { size: 11, fill: '#6C6C6C' });

  svg.appendChild(rc.line(240, 245, 690, 170, {
    stroke: '#6C6C6C', strokeWidth: 1, roughness: 1.5,
    strokeLineDash: [6, 4]
  }));
  addText(svg, 480, 210, 'reads', { size: 11, fill: '#6C6C6C' });

  addCaption(container, 'Agent architecture: each agent writes to its own directory, reads from others');
}

// ── Diagram 2: Pipeline Flow ──────────────────────────────────────────────────

function drawPipelineFlow() {
  var container = document.getElementById('diagram-pipeline-flow');
  if (!container) return;

  var W = 780, H = 280;
  var svg = createSVG(container, W, H);
  var rc = rough.svg(svg);

  // Monday pipeline
  addText(svg, 60, 55, 'Monday', { size: 14, weight: 700, fill: '#635BFF', anchor: 'middle' });

  var monSteps = ['CMO', 'SDR', 'Enrich', 'Events', 'Social'];
  var stepW = 110, stepH = 44, gap = 18, startX = 120, y1 = 30;

  monSteps.forEach(function (name, i) {
    var x = startX + i * (stepW + gap);
    svg.appendChild(rc.rectangle(x, y1, stepW, stepH, {
      fill: '#f1f3ff', fillStyle: 'solid', stroke: '#635BFF', roughness: 1.5
    }));
    addText(svg, x + stepW / 2, y1 + 28, name, { size: 13, weight: 600 });

    // Arrow to next
    if (i < monSteps.length - 1) {
      var ax = x + stepW;
      var nx = ax + gap;
      svg.appendChild(rc.line(ax, y1 + stepH / 2, nx, y1 + stepH / 2, {
        stroke: '#0a2540', strokeWidth: 1.5, roughness: 1
      }));
      // Arrowhead
      svg.appendChild(rc.line(nx, y1 + stepH / 2, nx - 6, y1 + stepH / 2 - 4, {
        stroke: '#0a2540', strokeWidth: 1.5, roughness: 0.5
      }));
      svg.appendChild(rc.line(nx, y1 + stepH / 2, nx - 6, y1 + stepH / 2 + 4, {
        stroke: '#0a2540', strokeWidth: 1.5, roughness: 0.5
      }));

      // Fail-forward bypass (dotted arc above)
      var midX = ax + gap / 2;
      svg.appendChild(rc.arc(midX, y1 - 2, gap + 20, 30, Math.PI, 0, false, {
        stroke: '#e5e5e5', strokeWidth: 1, roughness: 1.5,
        strokeLineDash: [4, 4], fill: 'none'
      }));
    }
  });

  // Thursday pipeline
  var y2 = 130;
  addText(svg, 60, y2 + 25, 'Thursday', { size: 14, weight: 700, fill: '#635BFF', anchor: 'middle' });

  var thuSteps = ['CMO', 'SDR', 'Enrich', 'CTO'];

  thuSteps.forEach(function (name, i) {
    var x = startX + i * (stepW + gap);
    svg.appendChild(rc.rectangle(x, y2, stepW, stepH, {
      fill: '#f1f3ff', fillStyle: 'solid', stroke: '#635BFF', roughness: 1.5
    }));
    addText(svg, x + stepW / 2, y2 + 28, name, { size: 13, weight: 600 });

    if (i < thuSteps.length - 1) {
      var ax = x + stepW;
      var nx = ax + gap;
      svg.appendChild(rc.line(ax, y2 + stepH / 2, nx, y2 + stepH / 2, {
        stroke: '#0a2540', strokeWidth: 1.5, roughness: 1
      }));
      svg.appendChild(rc.line(nx, y2 + stepH / 2, nx - 6, y2 + stepH / 2 - 4, {
        stroke: '#0a2540', strokeWidth: 1.5, roughness: 0.5
      }));
      svg.appendChild(rc.line(nx, y2 + stepH / 2, nx - 6, y2 + stepH / 2 + 4, {
        stroke: '#0a2540', strokeWidth: 1.5, roughness: 0.5
      }));

      var midX = ax + gap / 2;
      svg.appendChild(rc.arc(midX, y2 - 2, gap + 20, 30, Math.PI, 0, false, {
        stroke: '#e5e5e5', strokeWidth: 1, roughness: 1.5,
        strokeLineDash: [4, 4], fill: 'none'
      }));
    }
  });

  // Legend
  svg.appendChild(rc.line(120, 230, 160, 230, {
    stroke: '#0a2540', strokeWidth: 1.5, roughness: 1
  }));
  addText(svg, 210, 234, 'Data flow', { size: 12, fill: '#6C6C6C', anchor: 'start' });

  svg.appendChild(rc.arc(340, 225, 40, 20, Math.PI, 0, false, {
    stroke: '#e5e5e5', strokeWidth: 1, roughness: 1.5,
    strokeLineDash: [4, 4], fill: 'none'
  }));
  addText(svg, 380, 234, 'Fail-forward bypass', { size: 12, fill: '#6C6C6C', anchor: 'start' });

  addCaption(container, 'Weekly pipeline: two sequential chains with fail-forward design');
}

// ── Diagram 3: Approval Tiers ─────────────────────────────────────────────────

function drawApprovalTiers() {
  var container = document.getElementById('diagram-approval-tiers');
  if (!container) return;

  var W = 700, H = 320;
  var svg = createSVG(container, W, H);
  var rc = rough.svg(svg);

  // Lead In box
  svg.appendChild(rc.rectangle(20, 120, 100, 50, {
    fill: '#f1f3ff', fillStyle: 'solid', stroke: '#0a2540', roughness: 1.5
  }));
  addText(svg, 70, 150, 'Lead In', { size: 14, weight: 600 });

  // Arrow to Score
  svg.appendChild(rc.line(120, 145, 170, 145, {
    stroke: '#0a2540', strokeWidth: 1.5, roughness: 1
  }));
  svg.appendChild(rc.line(170, 145, 164, 140, { stroke: '#0a2540', strokeWidth: 1.5, roughness: 0.5 }));
  svg.appendChild(rc.line(170, 145, 164, 150, { stroke: '#0a2540', strokeWidth: 1.5, roughness: 0.5 }));

  // Score diamond
  var cx = 230, cy = 145;
  svg.appendChild(rc.polygon(
    [[cx, cy - 40], [cx + 50, cy], [cx, cy + 40], [cx - 50, cy]],
    { fill: '#635BFF', fillStyle: 'solid', stroke: '#0a2540', roughness: 1.5 }
  ));
  addText(svg, cx, cy + 5, 'Score', { size: 13, weight: 700, fill: '#fff' });

  // Branch 1: 70+ → Auto-send (green)
  svg.appendChild(rc.line(280, 115, 400, 50, {
    stroke: '#22c55e', strokeWidth: 2, roughness: 1
  }));
  addText(svg, 330, 70, '70+', { size: 13, weight: 700, fill: '#22c55e' });

  svg.appendChild(rc.rectangle(400, 25, 140, 50, {
    fill: '#dcfce7', fillStyle: 'solid', stroke: '#22c55e', roughness: 1.5
  }));
  addText(svg, 470, 55, 'Auto-send', { size: 14, weight: 600, fill: '#166534' });

  // Arrow to Sent
  svg.appendChild(rc.line(540, 50, 590, 50, {
    stroke: '#22c55e', strokeWidth: 1.5, roughness: 1
  }));
  svg.appendChild(rc.line(590, 50, 584, 45, { stroke: '#22c55e', strokeWidth: 1.5, roughness: 0.5 }));
  svg.appendChild(rc.line(590, 50, 584, 55, { stroke: '#22c55e', strokeWidth: 1.5, roughness: 0.5 }));

  svg.appendChild(rc.rectangle(590, 25, 90, 50, {
    fill: '#22c55e', fillStyle: 'solid', stroke: '#166534', roughness: 1.5
  }));
  addText(svg, 635, 55, 'Sent', { size: 14, weight: 700, fill: '#fff' });

  // Branch 2: 60-69 → Partner Review → Send (yellow)
  svg.appendChild(rc.line(280, 145, 400, 145, {
    stroke: '#f59e0b', strokeWidth: 2, roughness: 1
  }));
  addText(svg, 340, 138, '60-69', { size: 13, weight: 700, fill: '#f59e0b' });

  svg.appendChild(rc.rectangle(400, 120, 140, 50, {
    fill: '#fef3c7', fillStyle: 'solid', stroke: '#f59e0b', roughness: 1.5
  }));
  addText(svg, 470, 150, 'Partner Review', { size: 13, weight: 600, fill: '#92400e' });

  // Arrow to Send
  svg.appendChild(rc.line(540, 145, 590, 145, {
    stroke: '#f59e0b', strokeWidth: 1.5, roughness: 1
  }));
  svg.appendChild(rc.line(590, 145, 584, 140, { stroke: '#f59e0b', strokeWidth: 1.5, roughness: 0.5 }));
  svg.appendChild(rc.line(590, 145, 584, 150, { stroke: '#f59e0b', strokeWidth: 1.5, roughness: 0.5 }));

  svg.appendChild(rc.rectangle(590, 120, 90, 50, {
    fill: '#f59e0b', fillStyle: 'solid', stroke: '#92400e', roughness: 1.5
  }));
  addText(svg, 635, 150, 'Send', { size: 14, weight: 700, fill: '#fff' });

  // Branch 3: <40 → Archive (gray)
  svg.appendChild(rc.line(280, 175, 400, 240, {
    stroke: '#9ca3af', strokeWidth: 2, roughness: 1
  }));
  addText(svg, 330, 220, '<40', { size: 13, weight: 700, fill: '#9ca3af' });

  svg.appendChild(rc.rectangle(400, 215, 140, 50, {
    fill: '#f3f4f6', fillStyle: 'solid', stroke: '#9ca3af', roughness: 1.5
  }));
  addText(svg, 470, 245, 'Archive', { size: 14, weight: 600, fill: '#6b7280' });

  addCaption(container, 'Approval tiers: high-confidence leads auto-send, borderline leads wait for partner review');
}
