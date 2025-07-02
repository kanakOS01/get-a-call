interface FormData {
  companyName: string;
  personName: string;
  profileImage: string | null;
}

export async function generateCallScreen(canvas: HTMLCanvasElement, formData: FormData): Promise<string> {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Set canvas dimensions (iPhone aspect ratio)
  canvas.width = 1080;
  canvas.height = 1920;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Create gradient background (iOS-style dark)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a1a1a');
  gradient.addColorStop(1, '#2d2d2d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw call interface elements
  await drawCallInterface(ctx, canvas, formData);

  return canvas.toDataURL('image/png');
}

async function drawCallInterface(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, formData: FormData) {
  // Set font family
  ctx.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';

  // Top status bar area
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Incoming call', canvas.width / 2, 150);

  // Company name (smaller text)
  ctx.fillStyle = '#cccccc';
  ctx.font = '28px Inter, sans-serif';
  ctx.fillText(formData.companyName, canvas.width / 2, 200);

  // Profile picture area
  const profileX = canvas.width / 2;
  const profileY = 450;
  const profileRadius = 150;

  if (formData.profileImage) {
    await drawProfileImage(ctx, formData.profileImage, profileX, profileY, profileRadius);
  } else {
    // Default profile circle
    ctx.beginPath();
    ctx.arc(profileX, profileY, profileRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#4a4a4a';
    ctx.fill();
    
    // Default person icon
    ctx.fillStyle = '#888888';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👤', profileX, profileY + 25);
  }

  // Caller name (large)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(formData.personName, canvas.width / 2, 700);

  // Call type
  ctx.fillStyle = '#cccccc';
  ctx.font = '36px Inter, sans-serif';
  ctx.fillText('mobile', canvas.width / 2, 750);

  // Action buttons area
  drawActionButtons(ctx, canvas);

  // Bottom text
  ctx.fillStyle = '#cccccc';
  ctx.font = '28px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Slide to answer', canvas.width / 2, 1650);
}

async function drawProfileImage(
  ctx: CanvasRenderingContext2D, 
  imageSrc: string, 
  x: number, 
  y: number, 
  radius: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      
      // Calculate dimensions to fit image in circle
      const scale = Math.max((radius * 2) / img.width, (radius * 2) / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      ctx.drawImage(
        img, 
        x - scaledWidth / 2, 
        y - scaledHeight / 2, 
        scaledWidth, 
        scaledHeight
      );
      ctx.restore();
      resolve();
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}

function drawActionButtons(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  // Decline button (red circle)
  const declineX = canvas.width / 2 - 200;
  const declineY = 1500;
  const buttonRadius = 80;

  ctx.beginPath();
  ctx.arc(declineX, declineY, buttonRadius, 0, 2 * Math.PI);
  ctx.fillStyle = '#ff3b30';
  ctx.fill();

  // Accept button (green circle)
  const acceptX = canvas.width / 2 + 200;
  const acceptY = 1500;

  ctx.beginPath();
  ctx.arc(acceptX, acceptY, buttonRadius, 0, 2 * Math.PI);
  ctx.fillStyle = '#34c759';
  ctx.fill();

  // Button icons
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  
  // Decline icon (X)
  ctx.fillText('✕', declineX, declineY + 15);
  
  // Accept icon (checkmark)
  ctx.fillText('✓', acceptX, acceptY + 15);
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function copyImageToClipboard(dataUrl: string): Promise<void> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
  } catch (error) {
    // Fallback for browsers that don't support clipboard API
    throw new Error('Clipboard API not supported or permission denied');
  }
}
