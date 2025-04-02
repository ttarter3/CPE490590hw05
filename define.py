import torch
import torchvision

output_model = 'mnist.onnx'

device = 'cpu'
if torch.cuda.is_available():
    device = torch.device("cuda:0")

    properties = torch.cuda.get_device_properties(device)
    print(f"Device Name: {properties.name}")
    print(f"Total Memory: {properties.total_memory / 1e9:.2f} GB")
    print(f"Compute Capability: {properties.major}.{properties.minor}")
    print(f"Multi-processors: {properties.multi_processor_count}")

transform = torchvision.transforms.Compose([
    torchvision.transforms.ToTensor()
])