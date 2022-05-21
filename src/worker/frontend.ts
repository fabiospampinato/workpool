
/* IMPORT */

import WorkerShim from 'web-worker';
import WorkerBackend from './backend_compiled';
import type {Message} from '../types';

/* MAIN */

class WorkerFrontend {

  /* VARIABLES */

  private worker: Worker;

  /* CONSTRUCTOR */

  constructor ( methods: string, name: string, listener: Function ) {

    const Worker = globalThis.Worker || WorkerShim; // Ensuring Electron is supported

    const code = `data:text/javascript;charset=utf-8,${encodeURIComponent ( WorkerBackend.replace ( '/*! METHODS_PLACEHOLDER !*/', `\n\n\n${methods}` ) )}`; //TODO: Use Blobs instead, maybe

    this.worker = new Worker ( code, { name, type: 'module' } );

    this.listen ( listener );

  }

  /* API */

  listen ( listener: Function ): void {

    this.worker.addEventListener ( 'message', event => listener ( event.data ) );

  }

  send ( message: Message ): void {

    this.worker.postMessage ( message );

  }

  terminate (): void {

    this.worker.terminate ();

  }

}

/* EXPORT */

export default WorkerFrontend;
