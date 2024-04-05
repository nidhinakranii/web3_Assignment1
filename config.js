// Use Remix to deploy smart contract to local Ganache blockchain.
// Make note of the address the contract was deployed to, and paste it below.

let contractAddress = '0x9F1209AaAAcbcda461e02A5dAB905c748CDA382f';

// Define the smart contract ABI (Application Binary Interface).
let contractABI = [{
		"inputs": [{
			"internalType": "string",
			"name": "_description",
			"type": "string"
		}],
		"name": "addTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "uint256",
			"name": "_taskIndex",
			"type": "uint256"
		}],
		"name": "deleteTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "uint256",
			"name": "_taskIndex",
			"type": "uint256"
		}],
		"name": "getTask",
		"outputs": [{
			"components": [{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "isDone",
					"type": "bool"
				}
			],
			"internalType": "struct TaskTracker.Task",
			"name": "",
			"type": "tuple"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTaskCount",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
				"internalType": "uint256",
				"name": "_taskIndex",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_status",
				"type": "bool"
			}
		],
		"name": "updateBugStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];