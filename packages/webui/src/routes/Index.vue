<script setup lang="ts">

import {ref} from 'vue';
import symbolSdk from 'symbol-sdk';

const suffix=ref('');
const output=ref('');
const network=ref('testnet');
const mode=ref('endswith')
const numTotalAddressGenerated=ref(0);
const numVanityAddressGenerated=ref(0);
const startStop=ref('スタート')

let cancel:AbortController|undefined=undefined;

const isDesiredFactory=<any>{
	endswith:(
		s:string,
	)=>{
		return (
			address:string,
		)=>{
			for(let i=0;i<2;i++){
				if(address.endsWith(s,address.length-i)){
					return true;
				}
			}
			return false;
		};
	},
	startswith:(
		s:string,
	)=>{
		return (
			address:string,
		)=>{
			for(let i=0;i<3;i++){
				if(address.startsWith(s,i)){
					return true;
				}
			}
			return false;
		};
	},
	indexof:(
		s:string,
	)=>{
		return (
			address:string,
		)=>{
			return address.indexOf(s)>0;
		};
	},
	regex:(
		s:string,
	)=>{
		const re=eval(s)
		return (
			address:string,
		)=>{
			return address.match(re)!==null;
		};
	}
};

async function vanitygen(){
	const facade=new symbolSdk.facade.SymbolFacade(network.value);
	const isDesired=isDesiredFactory[mode.value](suffix.value);
	while(cancel!==undefined){
		const privateKey=symbolSdk
			.PrivateKey
			.random();
		const keyPair=new facade
			.constructor
			// @ts-ignore
			.KeyPair(privateKey);
		const address=facade
			.network
			.publicKeyToAddress(keyPair.publicKey);
		const addressString=address.toString();
		if(isDesired(addressString)){
			const privateKeyString=privateKey.toString();
			output.value+=`${privateKeyString}\t${addressString}\n`;
			numVanityAddressGenerated.value+=1;
		}
		numTotalAddressGenerated.value+=1;
		await new Promise<void>(
			(resolve,_)=>{
				setTimeout(
					()=>{
						resolve();
					},
					0,
				);
			},
		);
	}
}

function start(){
	if(cancel!==undefined){
		cancel.abort();
		startStop.value='スタート';
		cancel=undefined;
		return;
	}
	startStop.value='ストップ';
	cancel=new AbortController();
	vanitygen();
}

</script>

<template>
	<div class="">
		<h1 class="p-2 text-6xl">
			Symbol Vanity Address Generator
		</h1>
		<div class="p-2">
			<a href="/source.tar.zst">
				<button class="rounded-xl p-2 m-2 bg-blue-500 text-white">
					ソースコードはこちら
				</button>
			</a>
		</div>
		<div class="m-2">
			ネットワーク:
			<select v-model="network" class="rounded-xl border-2 border-blue-500 p-1">
				<option value="mainnet">mainnet</option>
				<option value="testnet">testnet</option>
			</select>
		</div>
		<div class="m-2 ">
			<input v-model="suffix" type="text" class="border-b-2 border-blue-500" />
			←が
			<select v-model="mode" class="rounded-xl border-2 border-blue-500 p-1">
				<option value="endswith">最後のほうに含まれている</option>
				<option value="startswith">最初のほうに含まれている</option>
				<option value="indexof">とにかく含まれている</option>
				<option value="regex">正規表現(/と/でかこむ)</option>
			</select>
		</div>
		<div class="m-2">
			<button class="rounded-xl border-2 border-blue-500 text-blue-500 p-1" @click="start">
				{{startStop}}
			</button>
		</div>
		<div class="m-2">
			成功した回数/生成した回数:{{numVanityAddressGenerated}}/{{numTotalAddressGenerated}}
		</div>
		<div class="m-2">
			結果:
		</div>
		<div class="m-2">
			<pre>{{output}}</pre>
		</div>
	</div>
</template>
