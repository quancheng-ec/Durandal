const grpc = require('grpc')

const zipkinBaseUrl = 'http://trace-fk.dev.quancheng-ec.com'

const CLSContext = require('zipkin-context-cls')

const { Tracer, BatchRecorder, ConsoleRecorder } = require('zipkin')
const { HttpLogger } = require('zipkin-transport-http')

const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: `${zipkinBaseUrl}/api/v1/spans`
  })
})

// const recorder = new ConsoleRecorder()
const ctxImpl = new CLSContext('zipkin')

const tracer = new Tracer({ ctxImpl, recorder })

const { Annotation } = require('zipkin')

const checkMetadata = metadata => (metadata && metadata instanceof grpc.Metadata ? metadata : new grpc.Metadata())

function wrapSaluki (grpcService, { serviceName = 'unknown', remoteRpcName = 'remote' }) {
  return function zipkinSaluki (req, metadata) {
    metadata = checkMetadata(metadata)

    return new Promise((resolve, reject) => {
      tracer.scoped(() => {
        tracer.setId(tracer.createChildId())
        const traceId = tracer.id
        metadata.add('x-b3-traceId', tracer.id.traceId)
        metadata.add('x-b3-parentspanid', tracer.id.parentId)
        metadata.add('x-b3-spanid', tracer.id.spanId)
        metadata.add('x-b3-sampled', tracer.id.sampled.getOrElse() ? '1' : '0')

        tracer.recordServiceName(serviceName)
        tracer.recordRpc(remoteRpcName)
        tracer.recordAnnotation(new Annotation.ClientSend())
        tracer.recordAnnotation(new Annotation.LocalAddr({}))
        tracer.recordBinary('grpc req body', JSON.stringify(req))

        grpcService(req, metadata)
          .then(res => {
            tracer.scoped(() => {
              tracer.setId(traceId)
              tracer.recordAnnotation(new Annotation.ClientRecv())
            })
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    })
  }
}

module.exports = wrapSaluki
