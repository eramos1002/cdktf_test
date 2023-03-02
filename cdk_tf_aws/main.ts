import { Construct } from "constructs";
import { App, TerraformStack, Token } from "cdktf";
import { Vpc } from "@cdktf/provider-aws/lib/vpc";
import { Subnet } from "@cdktf/provider-aws/lib/subnet";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { TerraformOutput } from "cdktf/lib/terraform-output";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new AwsProvider(this, 'aws', {
      region:'eu-west-1'
    })


    const vpc = new Vpc(this, 'myVPC', {
      cidrBlock: '10.0.0.0/16',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: {
        Name: "vpc-cdk"
      }      
    })
    
    new Subnet(this, 'mySubnetA', {
      vpcId: Token.asString(vpc.id),
      cidrBlock:'10.0.1.0/24'
    })

    new TerraformOutput(this, 'public_ip', {
      value: vpc.id
    })

    // define resources here
  }
}

const app = new App();
new MyStack(app, "cdk_tf_aws");
app.synth();
