"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.1.0",
    "name": "promise",
    "instructions": [
        {
            "name": "initializeNetwork",
            "accounts": [
                {
                    "name": "promiseNetwork",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "data",
                    "type": "bytes"
                },
                {
                    "name": "bump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "updateNetwork",
            "accounts": [
                {
                    "name": "promiseNetwork",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "data",
                    "type": "bytes"
                }
            ]
        },
        {
            "name": "initializePromisor",
            "accounts": [
                {
                    "name": "promisor",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promiseNetwork",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "bump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "updatePromisor",
            "accounts": [
                {
                    "name": "promisor",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promiseNetwork",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "state",
                    "type": {
                        "defined": "PromisorState"
                    }
                }
            ]
        },
        {
            "name": "initializePromise",
            "accounts": [
                {
                    "name": "promise",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promisor",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promisorOwner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "promiseNetwork",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "id",
                    "type": "i32"
                },
                {
                    "name": "promisorData",
                    "type": "bytes"
                },
                {
                    "name": "promiseeData",
                    "type": "bytes"
                },
                {
                    "name": "bump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "updatePromiseRules",
            "accounts": [
                {
                    "name": "promise",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promisor",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promisorOwner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "promisorData",
                    "type": "bytes"
                },
                {
                    "name": "promiseeData",
                    "type": "bytes"
                }
            ]
        },
        {
            "name": "updatePromiseActive",
            "accounts": [
                {
                    "name": "promise",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promisor",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promisorOwner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "updatePromiseCompleted",
            "accounts": [
                {
                    "name": "promisor",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promisee",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promise",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promisorOwner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "updatePromiseAccept",
            "accounts": [
                {
                    "name": "promisee",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promise",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "promiseeOwner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "bump",
                    "type": "u8"
                },
                {
                    "name": "creator",
                    "type": "publicKey"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "promiseNetwork",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "authority",
                        "type": "publicKey"
                    },
                    {
                        "name": "data",
                        "type": "bytes"
                    }
                ]
            }
        },
        {
            "name": "promisee",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "creator",
                        "type": "publicKey"
                    },
                    {
                        "name": "promise",
                        "type": "publicKey"
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    },
                    {
                        "name": "updatedAt",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "promise",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "id",
                        "type": "i32"
                    },
                    {
                        "name": "network",
                        "type": "publicKey"
                    },
                    {
                        "name": "promisor",
                        "type": "publicKey"
                    },
                    {
                        "name": "state",
                        "type": {
                            "defined": "PromiseState"
                        }
                    },
                    {
                        "name": "promiseeData",
                        "type": "bytes"
                    },
                    {
                        "name": "promisorData",
                        "type": "bytes"
                    },
                    {
                        "name": "updatedAt",
                        "type": "i64"
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    },
                    {
                        "name": "numPromisees",
                        "type": "i32"
                    }
                ]
            }
        },
        {
            "name": "promisor",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "promiseNetwork",
                        "type": "publicKey"
                    },
                    {
                        "name": "state",
                        "type": {
                            "defined": "PromisorState"
                        }
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    },
                    {
                        "name": "updatedAt",
                        "type": "i64"
                    },
                    {
                        "name": "numPromises",
                        "type": "i32"
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "EndDate",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "date",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "NftGate",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "requiredCollection",
                        "type": "publicKey"
                    }
                ]
            }
        },
        {
            "name": "StartDate",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "date",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "PromiseEndDate",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "date",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "SolWager",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "lamports",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "SolReward",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "lamports",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "NetworkRules",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "startDate",
                        "docs": [
                            "Start date rule (controls when a promisor account is created)."
                        ],
                        "type": {
                            "option": {
                                "defined": "StartDate"
                            }
                        }
                    },
                    {
                        "name": "endDate",
                        "docs": [
                            "End date rule (controls when a promisor account is created)."
                        ],
                        "type": {
                            "option": {
                                "defined": "EndDate"
                            }
                        }
                    },
                    {
                        "name": "nftGate",
                        "docs": [
                            "End date rule (controls when a promisor account is created)."
                        ],
                        "type": {
                            "option": {
                                "defined": "NftGate"
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "PromiseeRules",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "endDate",
                        "docs": [
                            "End date rule (controls when a promisor account is created)."
                        ],
                        "type": {
                            "option": {
                                "defined": "EndDate"
                            }
                        }
                    },
                    {
                        "name": "solWager",
                        "docs": [
                            "Allow for wagers to be created"
                        ],
                        "type": {
                            "option": {
                                "defined": "SolWager"
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "PromisorRules",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "solReward",
                        "docs": [
                            "End date rule (controls when a promisor account is created)."
                        ],
                        "type": {
                            "option": {
                                "defined": "SolReward"
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "PromiseState",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Created"
                    },
                    {
                        "name": "Active"
                    },
                    {
                        "name": "Completed"
                    },
                    {
                        "name": "Voided"
                    }
                ]
            }
        },
        {
            "name": "PromisorState",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Active"
                    },
                    {
                        "name": "InActive"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "Uninitialized",
            "msg": "Account not initialized"
        },
        {
            "code": 6001,
            "name": "PromisorAccountCreationNotLive",
            "msg": "Network unable to create promisor account. Check network rules"
        },
        {
            "code": 6002,
            "name": "PromisorAccountCreationExpired",
            "msg": "Network unable to create promisor account. Check network rules"
        },
        {
            "code": 6003,
            "name": "DeserializationError",
            "msg": "Unable to deserialize ruleset"
        },
        {
            "code": 6004,
            "name": "MissingRequiredCollection",
            "msg": "Missing the required collection"
        },
        {
            "code": 6005,
            "name": "IncorrectOwner",
            "msg": "Incorrect owner"
        },
        {
            "code": 6006,
            "name": "PublicKeyMismatch",
            "msg": "Public key mismatch"
        },
        {
            "code": 6007,
            "name": "MissingRequiredNFT",
            "msg": "Missing the required NFT"
        },
        {
            "code": 6008,
            "name": "PromisorNotActive",
            "msg": "Promisor account not active"
        },
        {
            "code": 6009,
            "name": "InvalidPromiseState",
            "msg": "Invalid promise state"
        },
        {
            "code": 6010,
            "name": "NotEnoughSOL",
            "msg": "Not enough SOL"
        },
        {
            "code": 6011,
            "name": "PromiseExpired",
            "msg": "Promimse expired"
        },
        {
            "code": 6012,
            "name": "NotEnoughAccounts",
            "msg": "Not enough accounts provided"
        },
        {
            "code": 6013,
            "name": "PromiseeCannotAccept",
            "msg": "Promisee cannot accept. Ruleset does not allow it"
        }
    ]
};
