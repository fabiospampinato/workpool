
/* IMPORT */

import WorkerShim from 'webworker-shim';
import WorkerBackend from '~/worker/backend_compiled';
import type {Message, Env} from '~/types';

/* MAIN */

class WorkerFrontend {

  /* VARIABLES */

  private worker: Worker;

  /* CONSTRUCTOR */

  constructor ( env: Env, methods: string, name: string, listener: Function ) {

    const code = `data:text/javascript;charset=utf-8,${encodeURIComponent ( WorkerBackend.replace ( 'globalThis.process.ENV_PLACEHOLDER', JSON.stringify ( env ) ).replace ( '/*! METHODS_PLACEHOLDER !*/', `\n\n\n${methods}` ) )}`;

    this.worker = new WorkerShim ( code, { name, type: 'module' } );

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
