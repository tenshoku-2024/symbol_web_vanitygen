
import {Buffer} from 'buffer';

export default {

	randomBytes(
		size:number,
	):Buffer{
		const random=new Uint8Array(size);
		crypto.getRandomValues(random);
		return Buffer.from(random);
	}
};
