<script setup lang="ts">

import {ref} from 'vue';
import symbolSdk from 'symbol-sdk';

const suffix=ref('');
const output=ref('');
const network=ref('testnet');
const numTotalAddressGenerated=ref(0);
const numVanityAddressGenerated=ref(0);

function start(){
	const facade=new symbolSdk.facade.SymbolFacade(network.value);
	while(true){
		const privateKey=symbolSdk.PrivateKey.random();
		// @ts-ignore
		const keyPair=new facade.constructor.KeyPair(privateKey);
		const address=facade.network.publicKeyToAddress(keyPair.publicKey);
		const addressString=address.toString();
		if(addressString.endsWith(suffix.value)){
			output.value+=`{privateKey.toString()}\t{addressString}\n`;
			numVanityAddressGenerated.value+=1;
		}
		numTotalAddressGenerated.value+=1;
	}
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
			この文字列で終わる:<input v-model="suffix" type="text" class="border-b-2 border-blue-500" />
		</div>
		<div class="m-2">
			<button class="rounded-xl border-2 border-blue-500 text-blue-500 p-1" @click="start">
				スタート
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
