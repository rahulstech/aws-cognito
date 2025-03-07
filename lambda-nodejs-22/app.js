exports.handler = async (event) => {
    const { name } = event;
    console.log(`Received event ${JSON.stringify(event,null,2)}`);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello ${name}`}),
    };
};