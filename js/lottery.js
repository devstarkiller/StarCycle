// Constants
const LOTTERY_PROGRAM_ID = 'YOUR_PROGRAM_ID_HERE'; // You'll replace this with your actual program ID
const SEVEN_STAR_MINT = 'FDRBwha8GtiR55BPz6Ucc9ThRtjFynZqgX1UvbV72bB8';
const SOLANA_RPC_URL = 'https://api.devnet.solana.com'; // Use mainnet when ready

// Global variables
let connection;
let wallet;
let publicKey;

// Connect to Solana when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize connection
  connection = new solanaWeb3.Connection(SOLANA_RPC_URL);

  // Set up wallet connection
  document.getElementById('connect-wallet').addEventListener('click', connectWallet);

  // Set up tabs
  setupTabs();

  // Load lotteries (empty at first, will populate after wallet connect)
  loadActiveLotteries();
  loadLotteryHistory();

  // Refresh lottery data every 15 seconds
  setInterval(refreshData, 15000);
});

// Tab functionality
function setupTabs() {
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        openTab(tabName);
      });
    }
  }

  function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].classList.remove('active');
    }
    
    // Remove active class from all tabs
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active');
    }
    
    // Show the selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to the clicked tab
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
  }
  
  // Remove active class from all tabs
  const tabs = document.getElementsByClassName('tab');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }
  
  // Show the selected tab content
  document.getElementById(tabName).classList.add('active');
  
  // Add active class to the clicked tab
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].textContent.toLowerCase().replace(' ', '-') === tabName) {
      tabs[i].classList.add('active');
      break;
    }
  }

// Connect to wallet
async function connectWallet() {
  try {
    // Check if Phantom is installed
    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    
    if (!isPhantomInstalled) {
      showNotification('Please install Phantom wallet extension first!', 'error');
      return;
    }

    // Connect to wallet
    await window.solana.connect();
    
    // Get public key
    publicKey = window.solana.publicKey.toString();
    
    // Update UI
    document.getElementById('not-connected').style.display = 'none';
    document.getElementById('connected').style.display = 'block';
    document.getElementById('wallet-address').textContent = shortenAddress(publicKey);
    
    // Get token balance
    getTokenBalance();
    
    // Reload lotteries with wallet connected
    loadActiveLotteries();

    showNotification('Wallet connected successfully!', 'success');
  } catch (error) {
    console.error('Error connecting wallet:', error);
    showNotification('Failed to connect wallet: ' + error.message, 'error');
  }
}

// Get token balance
async function getTokenBalance() {
  try {
    if (!publicKey) return;
    
    // This is a simplified example - in a real app, you'd use SPL Token methods
    // Mock balance for now
    document.getElementById('token-balance').textContent = '1.25';
    
    // In a real app, you'd do something like:
    // const tokenAccounts = await connection.getParsedTokenAccountsByOwner(new solanaWeb3.PublicKey(publicKey), {
    //   mint: new solanaWeb3.PublicKey(SEVEN_STAR_MINT)
    // });
    // 
    // if (tokenAccounts.value.length > 0) {
    //   const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    //   document.getElementById('token-balance').textContent = balance.toString();
    // } else {
    //   document.getElementById('token-balance').textContent = '0';
    // }
  } catch (error) {
    console.error('Error getting token balance:', error);
  }
}

// Load active lotteries
async function loadActiveLotteries() {
  try {
    const lotteryContainer = document.getElementById('lottery-container');
    
    // In a real app, you'd fetch active lotteries from your Solana program
    // For now, we'll use mock data
    const mockLotteries = [
      {
        id: '3',
        type: 'Low-Roller',
        prize: '0.5',
        entryFee: '0.08333',
        entries: 3,
        maxEntries: 7,
        status: 'OPEN'
      },
      {
        id: '2',
        type: 'High-Roller',
        prize: '1',
        entryFee: '0.16667',
        entries: 5,
        maxEntries: 7,
        status: 'OPEN'
      }
    ];
    
    // Clear container
    lotteryContainer.innerHTML = '';
    
    // Add lotteries
    mockLotteries.forEach(lottery => {
      const lotteryCard = createLotteryCard(lottery);
      lotteryContainer.appendChild(lotteryCard);
    });
    
    // In a real app, you'd fetch data from Solana like:
    // const programId = new solanaWeb3.PublicKey(LOTTERY_PROGRAM_ID);
    // const lotteries = await connection.getProgramAccounts(programId);
    // Parse and display each lottery...
  } catch (error) {
    console.error('Error loading lotteries:', error);
    document.getElementById('lottery-container').innerHTML = '<p>Error loading lotteries. Please try again later.</p>';
  }
}

// Create a lottery card element
function createLotteryCard(lottery) {
  const card = document.createElement('div');
  card.className = 'lottery-card';
  
  card.innerHTML = `
    <div class="lottery-header">
      ${lottery.type} Lottery #${lottery.id}
    </div>
    <div class="lottery-body">
      <p><b>Prize:</b> ${lottery.prize} 7STAR</p>
      <p><b>Entry Fee:</b> ${lottery.entryFee} 7STAR</p>
      <p><b>Entries:</b> <span class="entry-count">${lottery.entries}/${lottery.maxEntries}</span></p>
      <p><b>Status:</b> <span class="status status-${lottery.status === 'OPEN' ? 'open' : 'full'}">${lottery.status}</span></p>
      
      ${lottery.status === 'OPEN' ? `
      <div class="input-group">
        <label for="telegram-${lottery.id}">Telegram Username:</label>
        <input type="text" id="telegram-${lottery.id}" class="input-field" placeholder="@username">
      </div>
      <div class="input-group">
        <label for="discord-${lottery.id}">Discord Username:</label>
        <input type="text" id="discord-${lottery.id}" class="input-field" placeholder="username#0000">
      </div>
      <button class="btn" onclick="enterLottery('${lottery.type.toLowerCase()}', '${lottery.id}')">Enter Lottery</button>
      ` : ''}
    </div>
  `;
  
  return card;
}

// Load lottery history
async function loadLotteryHistory() {
  try {
    const historyContainer = document.getElementById('history-container');
    
    // In a real app, you'd fetch history from your Solana program
    // For now, we'll use mock data
    const mockHistory = [
      {
        id: '1',
        type: 'Low-Roller',
        prize: '0.5',
        winner: 'FGh4...x72B',
        date: 'April 15, 2025',
        status: 'Prize sent to winner'
      },
      {
        id: '1',
        type: 'High-Roller',
        prize: '1',
        winner: 'BdW2...5nTl',
        date: 'April 14, 2025',
        status: 'Prize sent to winner'
      }
    ];
    
    // Clear container
    historyContainer.innerHTML = '';
    
    // Add history items
    mockHistory.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      historyItem.innerHTML = `
        <p><b>${item.type} Lottery #${item.id}</b></p>
        <p>Prize: ${item.prize} 7STAR</p>
        <p>Winner: ${item.winner}</p>
        <p>Date: ${item.date}</p>
        <p>Status: ${item.status}</p>
      `;
      
      historyContainer.appendChild(historyItem);
    });
  } catch (error) {
    console.error('Error loading history:', error);
    document.getElementById('history-container').innerHTML = '<p>Error loading history. Please try again later.</p>';
  }
}

// Enter lottery
async function enterLottery(type, id) {
  if (!publicKey) {
    showNotification('Please connect your wallet first!', 'error');
    return;
  }
  
  // Get username inputs
  const telegramInput = document.getElementById(`telegram-${id}`);
  const discordInput = document.getElementById(`discord-${id}`);
  
  if (!telegramInput.value || !discordInput.value) {
    showNotification('Please provide both Telegram and Discord usernames', 'error');
    return;
  }
  
  showNotification('Processing your entry...', 'info');
  
  try {
    // In a real app, you'd create a transaction to call your Solana program
    // This is a simplified example
    
    // Mock successful entry
    setTimeout(() => {
      showNotification('Transaction confirmed! You have successfully entered the lottery.', 'success');
      
      // Update entry count in UI
      const entryCountElements = document.getElementsByClassName('entry-count');
      for (let i = 0; i < entryCountElements.length; i++) {
        if (entryCountElements[i].parentElement.parentElement.querySelector('.lottery-header').textContent.includes(`Lottery #${id}`)) {
          const text = entryCountElements[i].textContent;
          const [current, max] = text.split('/');
          const newCount = parseInt(current) + 1;
          entryCountElements[i].textContent = `${newCount}/${max}`;
          
          // Update status if full
          if (newCount >= parseInt(max)) {
            const statusElement = entryCountElements[i].parentElement.nextElementSibling.querySelector('.status');
            statusElement.textContent = 'FULL';
            statusElement.classList.remove('status-open');
            statusElement.classList.add('status-full');
            
            // Remove entry form if full
            const lotteryBody = entryCountElements[i].closest('.lottery-body');
            const inputGroups = lotteryBody.querySelectorAll('.input-group');
            inputGroups.forEach(group => group.remove());
            lotteryBody.querySelector('.btn').remove();
          }
          break;
        }
      }
      
      // Clear inputs
      telegramInput.value = '';
      discordInput.value = '';
      
      // In a real app, you'd refresh data from the blockchain
    }, 2000);
  } catch (error) {
    console.error('Error entering lottery:', error);
    showNotification('Failed to enter lottery: ' + error.message, 'error');
  }
}

// Refresh all data
function refreshData() {
  if (publicKey) {
    getTokenBalance();
  }
  loadActiveLotteries();
  loadLotteryHistory();
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';
  
  // Add classes based on type
  notification.className = 'notification';
  if (type === 'error') {
    notification.style.backgroundColor = '#ffcccc';
  } else if (type === 'success') {
    notification.style.backgroundColor = '#ccffcc';
  } else {
    notification.style.backgroundColor = '#ffffcc';
  }
  
  // Hide after 5 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
}

// Helper function to shorten addresses
function shortenAddress(address) {
  return address.slice(0, 4) + '...' + address.slice(-4);
}